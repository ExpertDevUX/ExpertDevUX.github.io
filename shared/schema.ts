import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("job_seeker"), // job_seeker, employer, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CV Templates
export const cvTemplates = pgTable("cv_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category"), // professional, creative, simple, technical, executive, student
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User CVs
export const cvs = pgTable("cvs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  templateId: integer("template_id").references(() => cvTemplates.id),
  title: varchar("title").notNull(),
  data: jsonb("data"), // Store CV content as JSON
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  logo: varchar("logo"),
  website: varchar("website"),
  industry: varchar("industry"),
  size: varchar("size"), // small, medium, large, enterprise
  location: varchar("location"),
  createdById: varchar("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  salaryMin: decimal("salary_min"),
  salaryMax: decimal("salary_max"),
  location: varchar("location").notNull(),
  jobType: varchar("job_type"), // full-time, part-time, contract, internship
  experienceLevel: varchar("experience_level"), // entry, junior, mid, senior, executive
  industry: varchar("industry"),
  companyId: integer("company_id").references(() => companies.id),
  postedById: varchar("posted_by_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  applicationDeadline: timestamp("application_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job Applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cvId: integer("cv_id").references(() => cvs.id),
  coverLetter: text("cover_letter"),
  status: varchar("status").default("pending"), // pending, reviewing, interview, rejected, accepted
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cvs: many(cvs),
  companies: many(companies),
  jobs: many(jobs),
  applications: many(applications),
}));

export const cvsRelations = relations(cvs, ({ one, many }) => ({
  user: one(users, { fields: [cvs.userId], references: [users.id] }),
  template: one(cvTemplates, { fields: [cvs.templateId], references: [cvTemplates.id] }),
  applications: many(applications),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  createdBy: one(users, { fields: [companies.createdById], references: [users.id] }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, { fields: [jobs.companyId], references: [companies.id] }),
  postedBy: one(users, { fields: [jobs.postedById], references: [users.id] }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  cv: one(cvs, { fields: [applications.cvId], references: [cvs.id] }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCvTemplateSchema = createInsertSchema(cvTemplates);
export const insertCvSchema = createInsertSchema(cvs);
export const insertCompanySchema = createInsertSchema(companies);
export const insertJobSchema = createInsertSchema(jobs);
export const insertApplicationSchema = createInsertSchema(applications);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCvTemplate = z.infer<typeof insertCvTemplateSchema>;
export type CvTemplate = typeof cvTemplates.$inferSelect;
export type InsertCv = z.infer<typeof insertCvSchema>;
export type Cv = typeof cvs.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
