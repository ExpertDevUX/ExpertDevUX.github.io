# CVBuilder Pro - Professional CV Builder & Job Search Platform

A comprehensive CV builder and job search platform similar to TopCV.vn, built with modern web technologies and powered by **ThongPham.Tech**.

## 🚀 Features

### For Job Seekers
- **Professional CV Builder** - 12 unique CV templates across different categories
- **Job Search** - Advanced search with location, industry, and salary filters  
- **Application Tracking** - Track your job applications and status
- **CV Templates** - Professional, Creative, Technical, Executive designs

### For Employers
- **Job Posting** - Create and manage job listings
- **Candidate Search** - Find qualified candidates
- **Application Management** - Review and manage applications
- **Company Profiles** - Showcase your company brand

### For Admins
- **System Management** - Monitor platform statistics
- **Content Moderation** - Manage jobs and user content
- **Analytics Dashboard** - Track platform performance

## 🎨 CV Template Categories

1. **Professional Modern** - Clean design for corporate environments
2. **Creative Designer** - Bold and colorful for creative professionals
3. **Simple Classic** - Minimalist focus on content
4. **Technical Engineer** - Structured layout for technical roles
5. **Executive Leader** - Sophisticated design for senior management
6. **Fresh Graduate** - Youth-friendly for students and new graduates
7. **Modern Minimalist** - Ultra-clean with plenty of white space
8. **Creative Portfolio** - Showcase creative work portfolio-style
9. **Tech Specialist** - Perfect for software developers and IT professionals
10. **Business Professional** - Traditional business format
11. **Startup Enthusiast** - Dynamic design for startup environments
12. **Academic Scholar** - Formal academic layout for research positions

## 🔐 Demo Accounts

### Job Seeker Account
- **Email**: demo@thongpham.tech
- **Password**: Login via Replit Authentication
- **Role**: Job Seeker
- **Access**: Create CVs, apply for jobs, track applications

### Demo Features
- Pre-populated CV templates to choose from
- Sample job listings from real companies
- Complete application workflow
- Profile management

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for modern UI development
- **Wouter** for lightweight client-side routing
- **Tailwind CSS + Shadcn UI** for responsive design
- **TanStack Query** for efficient data fetching
- **React Hook Form** for form management
- **Framer Motion** for smooth animations

### Backend
- **Express.js** with TypeScript for REST API
- **PostgreSQL** for reliable data storage
- **Drizzle ORM** for type-safe database operations
- **Replit Auth** for secure authentication
- **Express Session** with PostgreSQL session store

### Development Tools
- **Vite** for fast development and optimized builds
- **ESBuild** for efficient backend bundling
- **Drizzle Kit** for database migrations
- **PostCSS** with Tailwind for CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Replit account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thongpham/cvbuilder-pro.git
   cd cvbuilder-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Replit Auth (automatically provided in Replit environment)
   REPL_ID=your_repl_id
   SESSION_SECRET=your_session_secret
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Seed demo data**
   ```bash
   npx tsx server/seed.ts
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📱 Usage

### Creating a CV
1. Login via Replit Authentication
2. Navigate to "Tạo CV" in the main menu
3. Choose from 12 professional CV templates
4. Fill in your personal information, experience, education, and skills
5. Preview and download your completed CV

### Job Search
1. Browse jobs on the homepage or visit "Việc làm"
2. Use filters for location, industry, salary, and experience level
3. Click on job listings to view detailed information
4. Apply directly with your created CV

### For Employers
1. Login with employer role
2. Access the employer dashboard
3. Post new job listings
4. Review applications and candidate profiles

## 🔧 Development

### Database Schema
The application uses a comprehensive PostgreSQL schema with the following main entities:
- **Users** - Authentication and profile information
- **CV Templates** - Available CV design templates
- **CVs** - User-created CV documents
- **Companies** - Employer company profiles
- **Jobs** - Job listings and postings
- **Applications** - Job applications and status tracking

### API Endpoints
- `GET /api/auth/user` - Get current user information
- `GET /api/cv-templates` - List available CV templates
- `POST /api/cvs` - Create new CV
- `GET /api/jobs` - Search and filter job listings
- `POST /api/applications` - Submit job application

### Security Features
- Secure session management with PostgreSQL
- Role-based access control (job_seeker, employer, admin)
- Input validation and sanitization
- Protected API endpoints

## 🏢 Company Information

**ThongPham.Tech** - Leading technology company specializing in innovative software solutions and digital transformation.

- **Website**: https://thongpham.tech
- **Email**: contact@thongpham.tech
- **Address**: Ho Chi Minh city
## Download: https://github.com/ExpertDevUX/ExpertDevUX.github.io
## 📋 License

© 2024 ThongPham.Tech. All rights reserved.

---

**Built with ❤️ by ThongPham Technology**
