import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCvSchema, insertJobSchema, insertApplicationSchema, insertCompanySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // CV Template routes
  app.get('/api/cv-templates', async (req, res) => {
    try {
      const templates = await storage.getCvTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching CV templates:", error);
      res.status(500).json({ message: "Failed to fetch CV templates" });
    }
  });

  // CV routes
  app.get('/api/cvs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cvs = await storage.getUserCvs(userId);
      res.json(cvs);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      res.status(500).json({ message: "Failed to fetch CVs" });
    }
  });

  app.get('/api/cvs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const cv = await storage.getCv(id);
      
      if (!cv) {
        return res.status(404).json({ message: "CV not found" });
      }

      // Check if user owns this CV
      if (cv.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(cv);
    } catch (error) {
      console.error("Error fetching CV:", error);
      res.status(500).json({ message: "Failed to fetch CV" });
    }
  });

  app.post('/api/cvs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cvData = insertCvSchema.parse({ ...req.body, userId });
      const cv = await storage.createCv(cvData);
      res.json(cv);
    } catch (error) {
      console.error("Error creating CV:", error);
      res.status(500).json({ message: "Failed to create CV" });
    }
  });

  app.put('/api/cvs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns this CV
      const existingCv = await storage.getCv(id);
      if (!existingCv || existingCv.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const cvData = insertCvSchema.partial().parse(req.body);
      const cv = await storage.updateCv(id, cvData);
      res.json(cv);
    } catch (error) {
      console.error("Error updating CV:", error);
      res.status(500).json({ message: "Failed to update CV" });
    }
  });

  app.delete('/api/cvs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns this CV
      const existingCv = await storage.getCv(id);
      if (!existingCv || existingCv.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteCv(id);
      res.json({ message: "CV deleted successfully" });
    } catch (error) {
      console.error("Error deleting CV:", error);
      res.status(500).json({ message: "Failed to delete CV" });
    }
  });

  // Job routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const filters = {
        location: req.query.location as string,
        industry: req.query.industry as string,
        salaryMin: req.query.salaryMin as string,
        experienceLevel: req.query.experienceLevel as string,
        search: req.query.search as string,
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
      );
      
      const jobs = await storage.getJobs(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'employer' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only employers can post jobs" });
      }

      const jobData = insertJobSchema.parse({ ...req.body, postedById: userId });
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Company routes
  app.get('/api/companies', async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.post('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companyData = insertCompanySchema.parse({ ...req.body, createdById: userId });
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  // Application routes
  app.get('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applications = await storage.getUserApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationData = insertApplicationSchema.parse({ ...req.body, userId });
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.get('/api/jobs/:jobId/applications', isAuthenticated, async (req: any, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'employer' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const applications = await storage.getJobApplications(jobId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ message: "Failed to fetch job applications" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
