import { db } from "./db";
import { cvTemplates, companies, jobs, users } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed CV Templates
    console.log("📄 Creating CV Templates...");
    const templates = [
      {
        name: "Professional Modern",
        description: "Clean and modern design perfect for corporate environments and professional roles.",
        category: "professional",
        isActive: true,
      },
      {
        name: "Creative Designer",
        description: "Bold and colorful design ideal for creative professionals and design roles.",
        category: "creative",
        isActive: true,
      },
      {
        name: "Simple Classic",
        description: "Minimalist design that focuses on content and readability.",
        category: "simple",
        isActive: true,
      },
      {
        name: "Technical Engineer",
        description: "Structured layout perfect for technical and engineering positions.",
        category: "technical",
        isActive: true,
      },
      {
        name: "Executive Leader",
        description: "Sophisticated design for senior management and executive roles.",
        category: "executive",
        isActive: true,
      },
      {
        name: "Fresh Graduate",
        description: "Youth-friendly design perfect for students and recent graduates.",
        category: "student",
        isActive: true,
      },
      {
        name: "Modern Minimalist",
        description: "Ultra-clean design with plenty of white space for a professional look.",
        category: "professional",
        isActive: true,
      },
      {
        name: "Creative Portfolio",
        description: "Showcase your creative work with this portfolio-style CV template.",
        category: "creative",
        isActive: true,
      },
      {
        name: "Tech Specialist",
        description: "Perfect for software developers and IT professionals.",
        category: "technical",
        isActive: true,
      },
      {
        name: "Business Professional",
        description: "Traditional business format suitable for all corporate roles.",
        category: "professional",
        isActive: true,
      },
      {
        name: "Startup Enthusiast",
        description: "Dynamic design for startup environments and entrepreneurial roles.",
        category: "creative",
        isActive: true,
      },
      {
        name: "Academic Scholar",
        description: "Formal academic layout perfect for research and educational positions.",
        category: "simple",
        isActive: true,
      },
    ];

    await db.insert(cvTemplates).values(templates);
    console.log(`✅ Created ${templates.length} CV templates`);

    // Seed Demo User
    console.log("👤 Creating demo user...");
    await db.insert(users).values({
      id: "demo-user-123",
      email: "demo@thongpham.tech",
      firstName: "Demo",
      lastName: "User",
      role: "job_seeker",
    });

    // Seed Companies
    console.log("🏢 Creating companies...");
    const companiesData = [
      {
        name: "ThongPham Technology",
        description: "Leading technology company specializing in innovative software solutions and digital transformation.",
        industry: "Công nghệ thông tin",
        size: "100-500 nhân viên",
        location: "Hà Nội",
        website: "https://thongpham.tech",
        createdById: "demo-user-123",
      },
      {
        name: "FPT Software",
        description: "Global technology corporation providing IT services and digital solutions.",
        industry: "Công nghệ thông tin",
        size: "10000+ nhân viên",
        location: "Hà Nội",
        website: "https://fpt-software.com",
        createdById: "demo-user-123",
      },
      {
        name: "VNG Corporation",
        description: "Leading internet and technology company in Vietnam.",
        industry: "Công nghệ thông tin",
        size: "1000-5000 nhân viên",
        location: "TP. Hồ Chí Minh",
        website: "https://vng.com.vn",
        createdById: "demo-user-123",
      },
      {
        name: "Vietcombank",
        description: "One of Vietnam's leading commercial banks.",
        industry: "Tài chính - Ngân hàng",
        size: "10000+ nhân viên",
        location: "Hà Nội",
        website: "https://vietcombank.com.vn",
        createdById: "demo-user-123",
      },
      {
        name: "Vingroup",
        description: "Vietnam's largest private conglomerate.",
        industry: "Đa ngành",
        size: "10000+ nhân viên",
        location: "Hà Nội",
        website: "https://vingroup.net",
        createdById: "demo-user-123",
      },
    ];

    const insertedCompanies = await db.insert(companies).values(companiesData).returning();
    console.log(`✅ Created ${insertedCompanies.length} companies`);

    // Seed Jobs
    console.log("💼 Creating job listings...");
    const jobsData = [
      {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building user-facing web applications using modern JavaScript frameworks.",
        requirements: "3+ years experience with React/Vue.js, Strong knowledge of HTML/CSS/JavaScript, Experience with responsive design",
        benefits: "Competitive salary, Health insurance, Flexible working hours, Training opportunities",
        salaryMin: "20",
        salaryMax: "35",
        location: "Hà Nội",
        jobType: "full-time",
        experienceLevel: "senior",
        industry: "Công nghệ thông tin",
        companyId: insertedCompanies[0].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "Full Stack Developer",
        description: "Join our team as a Full Stack Developer and work on exciting projects using cutting-edge technologies.",
        requirements: "Experience with Node.js and React, Knowledge of databases (PostgreSQL/MongoDB), Understanding of RESTful APIs",
        benefits: "Attractive salary, Performance bonus, Modern office, Team building activities",
        salaryMin: "15",
        salaryMax: "25",
        location: "TP. Hồ Chí Minh",
        jobType: "full-time",
        experienceLevel: "mid",
        industry: "Công nghệ thông tin",
        companyId: insertedCompanies[1].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "Product Manager",
        description: "We are seeking a Product Manager to lead product development and strategy for our digital products.",
        requirements: "5+ years in product management, Experience with agile methodologies, Strong analytical skills",
        benefits: "High salary, Stock options, Leadership development, International opportunities",
        salaryMin: "30",
        salaryMax: "50",
        location: "Hà Nội",
        jobType: "full-time",
        experienceLevel: "senior",
        industry: "Công nghệ thông tin",
        companyId: insertedCompanies[2].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "Junior Software Engineer",
        description: "Great opportunity for fresh graduates to start their career in software development.",
        requirements: "Computer Science degree or equivalent, Basic programming knowledge, Eager to learn",
        benefits: "Training program, Mentorship, Career development, Friendly environment",
        salaryMin: "8",
        salaryMax: "12",
        location: "Đà Nẵng",
        jobType: "full-time",
        experienceLevel: "entry",
        industry: "Công nghệ thông tin",
        companyId: insertedCompanies[0].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "Marketing Specialist",
        description: "Looking for a creative Marketing Specialist to develop and execute marketing campaigns.",
        requirements: "Marketing degree, 2+ years experience, Social media expertise, Content creation skills",
        benefits: "Creative environment, Flexible schedule, Marketing budget, Growth opportunities",
        salaryMin: "12",
        salaryMax: "18",
        location: "Hà Nội",
        jobType: "full-time",
        experienceLevel: "junior",
        industry: "Marketing",
        companyId: insertedCompanies[3].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "DevOps Engineer",
        description: "Join our infrastructure team and help build scalable, reliable systems.",
        requirements: "Experience with AWS/Azure, Docker, Kubernetes, CI/CD pipelines, Linux administration",
        benefits: "Top-tier salary, Latest technology, Remote work options, Certification support",
        salaryMin: "25",
        salaryMax: "40",
        location: "TP. Hồ Chí Minh",
        jobType: "full-time",
        experienceLevel: "senior",
        industry: "Công nghệ thông tin",
        companyId: insertedCompanies[4].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "UX/UI Designer",
        description: "Create amazing user experiences for our digital products and services.",
        requirements: "Design portfolio, Figma/Sketch proficiency, User research experience, Prototyping skills",
        benefits: "Creative freedom, Design tools budget, Conferences, Portfolio development",
        salaryMin: "15",
        salaryMax: "25",
        location: "Hà Nội",
        jobType: "full-time",
        experienceLevel: "mid",
        industry: "Thiết kế",
        companyId: insertedCompanies[1].id,
        postedById: "demo-user-123",
        isActive: true,
      },
      {
        title: "Data Analyst",
        description: "Analyze data to help drive business decisions and insights.",
        requirements: "SQL proficiency, Python/R knowledge, Statistics background, Data visualization tools",
        benefits: "Data tools access, Learning budget, Flexible hours, Impactful work",
        salaryMin: "18",
        salaryMax: "28",
        location: "Hà Nội",
        jobType: "full-time",
        experienceLevel: "mid",
        industry: "Phân tích dữ liệu",
        companyId: insertedCompanies[2].id,
        postedById: "demo-user-123",
        isActive: true,
      },
    ];

    const insertedJobs = await db.insert(jobs).values(jobsData).returning();
    console.log(`✅ Created ${insertedJobs.length} job listings`);

    console.log("🎉 Database seeding completed successfully!");
    
    console.log("\n📋 Demo Account Information:");
    console.log("Email: demo@thongpham.tech");
    console.log("Role: Job Seeker");
    console.log("Note: Use Replit authentication to login");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };