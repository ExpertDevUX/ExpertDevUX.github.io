import {
  users,
  cvTemplates,
  cvs,
  companies,
  jobs,
  applications,
  type User,
  type UpsertUser,
  type CvTemplate,
  type InsertCvTemplate,
  type Cv,
  type InsertCv,
  type Company,
  type InsertCompany,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // CV Template operations
  getCvTemplates(): Promise<CvTemplate[]>;
  createCvTemplate(template: InsertCvTemplate): Promise<CvTemplate>;
  
  // CV operations
  getUserCvs(userId: string): Promise<Cv[]>;
  getCv(id: number): Promise<Cv | undefined>;
  createCv(cv: InsertCv): Promise<Cv>;
  updateCv(id: number, cv: Partial<InsertCv>): Promise<Cv>;
  deleteCv(id: number): Promise<void>;
  
  // Company operations
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;
  
  // Job operations
  getJobs(filters?: {
    location?: string;
    industry?: string;
    salaryMin?: string;
    experienceLevel?: string;
    search?: string;
  }): Promise<(Job & { company: Company })[]>;
  getJob(id: number): Promise<(Job & { company: Company }) | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;
  
  // Application operations
  getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]>;
  getJobApplications(jobId: number): Promise<(Application & { user: User; cv: Cv })[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;
  
  // Admin operations
  getStats(): Promise<{
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    totalCompanies: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // CV Template operations
  async getCvTemplates(): Promise<CvTemplate[]> {
    return await db.select().from(cvTemplates).where(eq(cvTemplates.isActive, true));
  }

  async createCvTemplate(template: InsertCvTemplate): Promise<CvTemplate> {
    const [newTemplate] = await db.insert(cvTemplates).values(template).returning();
    return newTemplate;
  }

  // CV operations
  async getUserCvs(userId: string): Promise<Cv[]> {
    return await db.select().from(cvs).where(eq(cvs.userId, userId)).orderBy(desc(cvs.updatedAt));
  }

  async getCv(id: number): Promise<Cv | undefined> {
    const [cv] = await db.select().from(cvs).where(eq(cvs.id, id));
    return cv;
  }

  async createCv(cv: InsertCv): Promise<Cv> {
    const [newCv] = await db.insert(cvs).values(cv).returning();
    return newCv;
  }

  async updateCv(id: number, cv: Partial<InsertCv>): Promise<Cv> {
    const [updatedCv] = await db
      .update(cvs)
      .set({ ...cv, updatedAt: new Date() })
      .where(eq(cvs.id, id))
      .returning();
    return updatedCv;
  }

  async deleteCv(id: number): Promise<void> {
    await db.delete(cvs).where(eq(cvs.id, id));
  }

  // Company operations
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }

  // Job operations
  async getJobs(filters?: {
    location?: string;
    industry?: string;
    salaryMin?: string;
    experienceLevel?: string;
    search?: string;
  }): Promise<(Job & { company: Company })[]> {
    const conditions = [eq(jobs.isActive, true)];

    if (filters) {
      if (filters.location) {
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
      }
      
      if (filters.industry) {
        conditions.push(eq(jobs.industry, filters.industry));
      }
      
      if (filters.experienceLevel) {
        conditions.push(eq(jobs.experienceLevel, filters.experienceLevel));
      }
      
      if (filters.salaryMin) {
        conditions.push(gte(jobs.salaryMax, filters.salaryMin));
      }
      
      if (filters.search) {
        conditions.push(
          or(
            ilike(jobs.title, `%${filters.search}%`),
            ilike(jobs.description, `%${filters.search}%`),
            ilike(companies.name, `%${filters.search}%`)
          )
        );
      }
    }

    const results = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt));
      
    return results.map(result => ({
      ...result.jobs,
      company: result.companies,
    }));
  }

  async getJob(id: number): Promise<(Job & { company: Company }) | undefined> {
    const [result] = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.jobs,
      company: result.companies,
    };
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Application operations
  async getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]> {
    const results = await db
      .select()
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.appliedAt));

    return results.map(result => ({
      ...result.applications,
      job: {
        ...result.jobs,
        company: result.companies,
      },
    }));
  }

  async getJobApplications(jobId: number): Promise<(Application & { user: User; cv: Cv })[]> {
    const results = await db
      .select()
      .from(applications)
      .innerJoin(users, eq(applications.userId, users.id))
      .leftJoin(cvs, eq(applications.cvId, cvs.id))
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.appliedAt));

    return results.map(result => ({
      ...result.applications,
      user: result.users,
      cv: result.cvs || {} as Cv,
    }));
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ ...application, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  // Admin operations
  async getStats(): Promise<{
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    totalCompanies: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [jobCount] = await db.select({ count: sql<number>`count(*)` }).from(jobs);
    const [applicationCount] = await db.select({ count: sql<number>`count(*)` }).from(applications);
    const [companyCount] = await db.select({ count: sql<number>`count(*)` }).from(companies);

    return {
      totalUsers: userCount.count,
      totalJobs: jobCount.count,
      totalApplications: applicationCount.count,
      totalCompanies: companyCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
