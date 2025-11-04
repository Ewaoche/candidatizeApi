# Backend Technical Setup Guide

## Candidate Categorization Platform - NestJS Backend

This guide provides detailed instructions for setting up, configuring, and running the NestJS backend API for the Candidate Categorization Platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Configuration Details](#configuration-details)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **MongoDB**: Version 5.0 or higher
  - Local installation or MongoDB Atlas cloud account
  - Connection string ready (e.g., `mongodb://localhost:27017` or MongoDB Atlas URI)
- **Git**: For version control
- **Postman/Insomnia**: Optional, for API testing

### Optional Tools

- **Docker**: For containerized deployment
- **Visual Studio Code**: Recommended IDE

---

## Project Structure

\`\`\`
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── dto/
│   ├── candidates/              # Candidate management module
│   │   ├── candidates.controller.ts
│   │   ├── candidates.service.ts
│   │   ├── candidates.module.ts
│   │   └── dto/
│   ├── skills/                  # Skills management module
│   │   ├── skills.controller.ts
│   │   ├── skills.service.ts
│   │   ├── skills.module.ts
│   │   └── dto/
│   ├── tier/                    # Tier categorization module
│   │   ├── tier.controller.ts
│   │   ├── tier.service.ts
│   │   ├── tier.module.ts
│   │   └── dto/
│   ├── analytics/               # Analytics module
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── analytics.module.ts
│   ├── export/                  # Export module (CSV/Excel)
│   │   ├── export.controller.ts
│   │   ├── export.service.ts
│   │   └── export.module.ts
│   ├── email/                   # Email notifications module
│   │   ├── email.service.ts
│   │   └── email.module.ts
│   ├── config/                  # Configuration services
│   │   └── jwt.config.ts
│   ├── prisma/                  # Prisma ORM module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts            # Root application module
│   └── main.ts                  # Application entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
└── README.md

\`\`\`

---

## Installation

### Step 1: Clone or Extract the Project



### Step 2: Install Dependencies

\`\`\`bash
# Using npm
bun  install



### Step 3: Install MongoDB (if using locally)

**On macOS:**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
\`\`\`

**On Linux (Ubuntu/Debian):**
\`\`\`bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
\`\`\`

**On Windows:**
- Download from [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- Run the installer and follow the setup wizard

**Using Docker:**
\`\`\`bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

---

## Environment Configuration

### Step 1: Create `.env` File

\`\`\`bash
cp .env.example .env
\`\`\`

### Step 2: Configure Environment Variables

Edit `.env` file with your settings:

\`\`\`env
# Database
DATABASE_URL=mongodb://localhost:27017/candidate-categorization
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster0.mongodb.net/candidate-categorization?retryWrites=true&w=majority

# Server
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=24h

# Email Service (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@candidatecategorization.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000



### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/candidate-db` |
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `JWT_SECRET` | Secret key for JWT tokens | `super_secret_key_123` |
| `JWT_EXPIRATION` | Token expiration time | `24h` |
| `RESEND_API_KEY` | Email provider | `gmail` |
| 
| `RESEND_FROM_EMAIL` | Sender email address | `desisHub@info.com` |
| `FRONTEND_URL` | Frontend URL for links | `http://localhost:3000` |

---

## Database Setup

### Step 1: Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

### Step 2: Run Database



### Step 3: Verify Database Connection

\`\`\`bash
# Open Prisma Studio to view data
npx prisma studio
\`\`\`

The Prisma Studio will open at `http://localhost:5555` where you can view and manage your database.

---

## Running the Application

### Development Mode

\`\`\`bash
# Start with auto-reload on file changes
npm run dev



The API will be available at `http://localhost:3001`

### Production Build

\`\`\`bash
# Build the application
npm run build

# Start the production build
npm run start:prod
\`\`\`

### Using Docker

\`\`\`bash
# Build Docker image
docker build -t candidate-api:latest .

# Run container
docker run -p 3001:3001 --env-file .env candidate-api:latest
\`\`\`

---

## API Endpoints

### Authentication Endpoints

**Register Admin**
\`\`\`
POST /auth/register
Body: { email, password, name }
\`\`\`

**Login Admin**
\`\`\`
POST /auth/login
Body: { email, password }
Response: { access_token }
\`\`\`

### Candidate Endpoints

**Register Candidate**
\`\`\`
POST /candidates/register
Body: { 
  name, 
  email, 
  phone, 
  location, 
  experience_level 
}
\`\`\`

**Get All Candidates**
\`\`\`
GET /candidates?page=1&limit=10&search=john&tier=Tier%202
Headers: Authorization: Bearer <token>
\`\`\`

**Get Single Candidate**
\`\`\`
GET /candidates/:id
Headers: Authorization: Bearer <token>
\`\`\`

**Update Candidate**
\`\`\`
PATCH /candidates/:id
Body: { name, email, phone, location }
Headers: Authorization: Bearer <token>
\`\`\`

**Delete Candidate**
\`\`\`
DELETE /candidates/:id
Headers: Authorization: Bearer <token>
\`\`\`

### Skills Endpoints

**Add Skill to Candidate**
\`\`\`
POST /skills/add
Body: { candidateId, skill_name, proficiency (0-10), years_of_experience }
\`\`\`

**Get Candidate Skills**
\`\`\`
GET /skills/:candidateId
\`\`\`

**Update Skill**
\`\`\`
PATCH /skills/:skillId
Body: { proficiency, years_of_experience }
\`\`\`

**Delete Skill**
\`\`\`
DELETE /skills/:skillId
\`\`\`

### Tier & Assessment Endpoints

**Assess Candidate & Assign Tier**
\`\`\`
POST /tier/assess
Body: { candidateId }
Response: { tier_assigned, score, skills_summary }
Headers: Authorization: Bearer <token>
\`\`\`

**Get Tier Distribution**
\`\`\`
GET /tier/distribution
Headers: Authorization: Bearer <token>
\`\`\`

### Analytics Endpoints

**Get Dashboard Analytics**
\`\`\`
GET /analytics/dashboard
Headers: Authorization: Bearer <token>
Response: { 
  total_candidates, 
  assessed_count, 
  tier_distribution, 
  skill_analytics 
}
\`\`\`

**Get Skill Analytics**
\`\`\`
GET /analytics/skills
Headers: Authorization: Bearer <token>
\`\`\`

### Export Endpoints

**Export Candidates to CSV**
\`\`\`
GET /export/csv?tier=Tier%202&search=john
Headers: Authorization: Bearer <token>
Response: CSV file
\`\`\`

**Export Candidates to Excel**
\`\`\`
GET /export/excel?tier=Tier%202
Headers: Authorization: Bearer <token>
Response: Excel file
\`\`\`

---

## Configuration Details

### JWT Configuration

JWT is configured via the `jwt.config.ts` factory pattern:

\`\`\`typescript
// Configuration loaded from environment
{
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION || '24h'
}
\`\`\`

### Database Schema Overview

**Collections:**

1. **Admin** - Admin users for platform access
2. **Candidate** - Candidate information and profiles
3. **Skill** - Skills associated with candidates
4. **Assessment** - Assessment records and tier assignments

### Tier Categorization Algorithm

The tier assignment is based on:
- Average skill proficiency level
- Total years of experience
- Number of skills
- Skill relevance and tier mapping

**Tier Distribution:**
- **Tier 0** (Entry Level): 0-2 average proficiency
- **Tier 1** (Beginner): 2-4 average proficiency
- **Tier 2** (Intermediate): 4-6 average proficiency
- **Tier 3** (Advanced): 6-7.5 average proficiency
- **Tier 4** (Expert): 7.5-9 average proficiency
- **Tier 5** (Master): 9-10 average proficiency

---

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
\`\`\`bash
# Check MongoDB is running
# Local: mongo --version
# Docker: docker ps | grep mongo

# Verify connection string in .env
DATABASE_URL=mongodb://localhost:27017/candidate-categorization

# Restart MongoDB if needed
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
\`\`\`

### Issue: JWT Token Invalid

**Solution:**
- Ensure `JWT_SECRET` is set in `.env`
- Check token hasn't expired
- Verify `Authorization` header format: `Bearer <token>`

### Issue: Email Not Sending

**Solution:**
\`\`\`bash
# Verify email configuration in .env
# For Gmail:
# 1. Enable 2-factor authentication
# 2. Generate app-specific password
# 3. Use app password in EMAIL_PASSWORD

# Check email service logs
npm run start:dev  # View console for email errors
\`\`\`

### Issue: Prisma Migration Failed

**Solution:**
\`\`\`bash
# Reset database (development only)
npx prisma migrate reset

# Or manually drop database and rerun migrations
# MongoDB: db.dropDatabase()
npx prisma migrate deploy
\`\`\`

### Issue: Port Already in Use

**Solution:**
\`\`\`bash
# Change port in .env
PORT=3002

# OR kill process using the port
# Linux/macOS:
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
\`\`\`

---

## Performance Tips

1. **Enable Query Caching**: Use Redis for frequently accessed data
2. **Database Indexing**: Add indexes on frequently queried fields
3. **Pagination**: Always paginate large result sets
4. **Rate Limiting**: Implement rate limiting on public endpoints
5. **Compression**: Enable gzip compression for responses

---

## Security Considerations

1. **Environment Variables**: Never commit `.env` to version control
2. **JWT Secret**: Use a strong, random secret in production
3. **CORS**: Configure CORS appropriately for your frontend domain
4. **Input Validation**: All DTO validation is enabled
5. **Authentication**: All admin endpoints require JWT authentication

---

