# Candidate Categorization Platform - Backend API

A comprehensive NestJS backend API for managing candidate registration, skill assessment, and automatic tier categorization.

## Features

- **Authentication**: JWT-based admin authentication
- **Candidate Management**: Register, update, and manage candidates
- **Skill Assessment**: Add and track self-declared skills with proficiency levels
- **Automatic Tier Categorization**: 6-tier system (Tier 0-5) based on skills assessment
- **Analytics Dashboard**: Real-time statistics and tier distribution
- **CSV/Excel Export**: Export candidate lists with detailed skill information
- **Search & Filtering**: Advanced search and filtering capabilities
- **Email Notifications**: Automated email notifications for tier assignments

## Setup

### Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
bun  install
\`\`\`

2. Set up environment variables by copying `.env.example` to `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update `.env` with your MongoDB connection string and email configuration.

4. Generate Prisma client:
\`\`\`bash
npx  prisma generate
npx  prisma db  push


\`\`\`

### Detailed Setup Guide

For comprehensive setup instructions, environment configuration, and troubleshooting, see **[SETUP.md](SETUP.md)**

<!-- Added link to detailed technical setup guide -->

## Running the Application

### Development

\`\`\`bash
npm run dev
\`\`\`

### Production

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new admin
- `POST /auth/login` - Login and get JWT token

### Candidates
- `POST /candidates/register` - Register a new candidate
- `GET /candidates` - Get all candidates (paginated, searchable)
- `GET /candidates/:id` - Get candidate details
- `PUT /candidates/:id` - Update candidate information
- `DELETE /candidates/:id` - Delete a candidate

### Skills
- `POST /candidates/:candidateId/skills` - Add skill for candidate
- `GET /candidates/:candidateId/skills` - Get candidate's skills
- `PUT /candidates/:candidateId/skills/:skillId` - Update skill
- `DELETE /candidates/:candidateId/skills/:skillId` - Delete skill

### Tier Assessment
- `POST /tier/assess/:candidateId` - Assess and assign tier to candidate
- `GET /tier/distribution` - Get tier distribution statistics
- `GET /tier/stats` - Get detailed tier statistics

### Analytics
- `GET /analytics/dashboard` - Get dashboard statistics
- `GET /analytics/skills` - Get skill analytics
- `GET /analytics/locations` - Get location-based analytics
- `GET /analytics/experience` - Get experience level analytics

### Export
- `GET /export/csv` - Export candidates to CSV
- `GET /export/excel` - Export candidates with skills to Excel

## Tier System

The platform uses a 6-tier categorization system:

- **Tier 0** (0-20): Entry Level
- **Tier 1** (20-35): Beginner
- **Tier 2** (35-55): Intermediate
- **Tier 3** (55-70): Advanced
- **Tier 4** (70-85): Expert
- **Tier 5** (85-100): Master

Tier assignment is based on the average proficiency of skills and years of experience.

## Database Schema

The application uses MongoDB with Prisma ORM. Key collections:

- **Admin**: Admin user accounts with authentication
- **Candidate**: Candidate profiles and tier assignments
- **Skill**: Self-declared skills with proficiency ratings


## Security Considerations

- JWT-based authentication for admin endpoints
- Input validation using class-validator
- Password hashing with bcryptjs
- Environment-based configuration
- CORS protection
- Request validation pipes

## Development

### Generate Prisma Client
\`\`\`bash
npx run prisma generate
npx run prisma db push
\`\`\`

### Run Tests
\`\`\`bash
npm test
\`\`\`

### Format Code
\`\`\`bash
npm run format
\`\`\`



### Environment Variables Required

- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `SMTP_HOST`: Email SMTP server
- `SMTP_PORT`: Email SMTP port
- `SMTP_USER`: Email account username
- `SMTP_PASS`: Email account password
- `SMTP_FROM`: From email address




