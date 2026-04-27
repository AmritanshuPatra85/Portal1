EduVora — Full Stack E-Learning Platform

Amazon Web Services Razorpay React Node.js MySQL

Production-grade e-learning platform built with a modern full-stack architecture supporting:

✅ Students
✅ Teachers
✅ Admins
✅ Paid enrollments
✅ Secure video streaming
✅ Real-time course progress tracking

Built like a real SaaS product, not a toy CRUD app.

Features
Student Portal
Browse published courses
Search free / paid courses
Instant free enrollment
Razorpay payment integration
Secure AWS S3 video streaming
Auto progress tracking (90% watched = completed)
Course announcements
Profile management
Teacher Portal
Create courses
Edit courses
Curriculum builder
Upload lectures to S3
Student analytics
Ratings & reviews dashboard
Post announcements
Admin Portal
Platform analytics
Revenue dashboard
Manage users
Ban / unban accounts
Role switching (Student ↔ Teacher)
Global announcements
Tech Stack
Layer	Tech
Frontend	React + Vite + Tailwind
Backend	Node.js + Express
Database	MySQL
Authentication	JWT + bcrypt
Storage	AWS S3
Payments	Razorpay
Deployment	AWS EC2 + Docker
Architecture
Frontend (React)
      ↓
REST API (Express)
      ↓
MySQL Database
      ↓
AWS S3 (Video Storage)
      ↓
Razorpay (Payments)
Core Modules
Auth
Profiles
Courses
Modules
Lectures
Payments
Enrollments
Progress Tracking
Announcements
Reviews
Admin Dashboard
Project Structure
EduVora/
 ├── frontend/
 │   ├── pages/
 │   ├── components/
 │   ├── utils/
 │   └── .env
 │
 ├── backend/
 │   ├── config/
 │   ├── middleware/
 │   ├── routes/
 │   ├── controllers/
 │   └── .env
API Overview
Auth
POST /api/auth/register
POST /api/auth/login
Courses
GET    /api/courses
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
Payments
POST /api/payments/create-order
POST /api/payments/verify

Detailed endpoints → docs/API.md

Deployment
Frontend → AWS S3 Static Hosting
Backend → AWS EC2 + Docker
Reverse Proxy → Nginx
SSL → Certbot
Database → MySQL
Media → AWS S3

Run Locally
Backend
cd backend
npm install
node app.js
Frontend
cd frontend
npm install
npm run dev
