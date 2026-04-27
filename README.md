# 🎓 EduVora — Full Stack E-Learning Platform

A production-grade full stack e-learning platform with role-based access, secure video streaming, payments, and progress tracking.

---

## 🚀 Features

### 👨‍🎓 Student Portal
- Browse published courses
- Search free / paid courses
- Instant free enrollment
- Razorpay payment integration
- Secure AWS S3 video streaming
- Auto progress tracking (90% watched = completed)
- Course announcements
- Profile management

### 👨‍🏫 Teacher Portal
- Create courses
- Edit courses
- Curriculum builder
- Upload lectures to AWS S3
- Student analytics
- Ratings & reviews dashboard
- Post announcements

### 👨‍💼 Admin Portal
- Platform analytics
- Revenue dashboard
- Manage users
- Ban / unban accounts
- Role switching (Student ↔ Teacher)
- Global announcements

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MySQL |
| Authentication | JWT + bcrypt |
| Storage | AWS S3 |
| Payments | Razorpay |
| Deployment | AWS EC2 + Docker |

---

## 🏗 Architecture

```text
Frontend (React)
      ↓
REST API (Express)
      ↓
MySQL Database
      ↓
AWS S3 (Video Storage)
      ↓
Razorpay (Payments)
```

---

## 📦 Core Modules

- Authentication
- Profiles
- Courses
- Modules
- Lectures
- Payments
- Enrollments
- Progress Tracking
- Announcements
- Reviews
- Admin Dashboard

---

## 📁 Project Structure

```bash
EduVora/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── utils/
│   └── .env
│
└── backend/
    ├── config/
    ├── middleware/
    ├── routes/
    ├── controllers/
    └── .env
```

---

## 🔌 API Overview

### Auth
```http
POST /api/auth/register
POST /api/auth/login
```

### Courses
```http
GET    /api/courses
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### Payments
```http
POST /api/payments/create-order
POST /api/payments/verify
```

---

## 🌍 Deployment

- Frontend → AWS S3 Static Hosting
- Backend → AWS EC2 + Docker
- Reverse Proxy → Nginx
- SSL → Certbot
- Database → MySQL
- Media Storage → AWS S3

