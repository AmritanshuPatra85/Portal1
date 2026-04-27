EduVora-Full Stack E-Learning Platform
EduVora is a production-grade e-learning platform built with a modern full stack. It supports three user roles (admin, teacher, student), paid course enrollment via Razorpay, video streaming from AWS S3, and real-time progress tracking.

Live Demo

Deployment in progress — will be hosted on AWS EC2 + S3


Features
Student

Browse and search published courses (free and paid)
Enroll in free courses instantly
Pay for paid courses via Razorpay (UPI, cards, netbanking)
Watch video lectures streamed securely from AWS S3
Automatic progress tracking (marks complete at 90% watched)
View course announcements from teachers
Edit personal profile (bio, mobile, date of birth, avatar)

Teacher

Create, edit, and manage courses
Build curriculum with modules and lectures
Upload video lectures directly to AWS S3
Post announcements to enrolled students
View enrollment stats and ratings per course

Admin

View platform-wide stats (students, teachers, courses, revenue)
Ban and unban user accounts
Change user roles (student ↔ teacher)
Post platform-wide announcements
View all announcements


Tech Stack
LayerTechnologyFrontendReact, Vite, Tailwind CSSBackendNode.js, Express (ES Modules)DatabaseMySQLFile StorageAWS S3 (ap-south-1)PaymentsRazorpayAuthJWT + bcryptDeploymentAWS EC2 (Docker), AWS S3 (static frontend)

Project Structure
EduVora/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Student dashboard
│   │   │   ├── CourseList.jsx         # Browse courses
│   │   │   ├── CourseDetail.jsx       # Course info + enrollment
│   │   │   ├── CoursePlayer.jsx       # Video player + progress
│   │   │   ├── Profile.jsx            # Student profile
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── teacher/
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── CreateCourse.jsx
│   │   │   │   ├── EditCourse.jsx
│   │   │   │   └── CurriculumBuilder.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       └── Announcements.jsx
│   │   ├── components/
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── Navbar.jsx
│   │   └── utils/
│   │       └── api.js                 # Axios instance with JWT interceptor
│   └── .env                           # VITE_API_URL, VITE_RAZORPAY_KEY_ID
│
└── backend/                   # Node.js + Express API
    ├── app.js                         # Entry point
    ├── config/
    │   ├── db.js                      # MySQL connection pool
    │   └── s3.js                      # AWS S3 client
    ├── middleware/
    │   └── auth.js                    # verifyToken, requireRole
    ├── routes/
    │   ├── index.js                   # Mounts all routes under /api
    │   ├── authRoutes.js
    │   ├── profileRoutes.js
    │   ├── courseRoutes.js
    │   ├── moduleRoutes.js
    │   ├── uploadRoutes.js
    │   ├── enrollmentRoutes.js
    │   ├── progressRoutes.js
    │   ├── paymentRoutes.js
    │   ├── adminRoutes.js
    │   ├── announcementRoutes.js
    │   └── reviewRoutes.js
    ├── controllers/
    │   ├── profileController.js
    │   ├── courseController.js
    │   ├── moduleController.js
    │   ├── lectureController.js
    │   ├── uploadController.js
    │   ├── enrollmentController.js
    │   ├── progressController.js
    │   ├── paymentController.js
    │   ├── adminController.js
    │   ├── announcementController.js
    │   └── reviewController.js
    └── .env                           # DB, AWS, Razorpay, JWT secrets

API Reference
Auth
MethodRouteAccessDescriptionPOST/api/auth/registerPublicRegister a new userPOST/api/auth/loginPublicLogin and receive JWT
Courses
MethodRouteAccessDescriptionGET/api/coursesPublicGet all published coursesGET/api/courses/:idPublicGet single courseGET/api/courses/my/coursesTeacherGet teacher's own coursesPOST/api/coursesTeacherCreate a coursePUT/api/courses/:idTeacherUpdate a courseDELETE/api/courses/:idTeacherDelete a course
Modules & Lectures
MethodRouteAccessDescriptionGET/api/modules/:course_idPublicGet modules for a coursePOST/api/modulesTeacherCreate a modulePUT/api/modules/:idTeacherUpdate a moduleDELETE/api/modules/:idTeacherDelete a moduleGET/api/modules/lectures/:module_idPublicGet lectures for a modulePOST/api/modules/lecturesTeacherCreate a lecturePUT/api/modules/lectures/:idTeacherUpdate a lectureDELETE/api/modules/lectures/:idTeacherDelete a lecture
Video
MethodRouteAccessDescriptionPOST/api/upload/videoTeacherUpload video to S3GET/api/upload/video/:lecture_idStudentStream video from S3
Enrollment
MethodRouteAccessDescriptionGET/api/enrollments/check/:course_idPrivateCheck enrollment statusPOST/api/enrollments/free/:course_idStudentEnroll in free courseGET/api/enrollments/myStudentGet enrolled courses
Progress
MethodRouteAccessDescriptionPOST/api/progressStudentSave lecture progressGET/api/progress/course/:course_idStudentGet course progress
Payments
MethodRouteAccessDescriptionPOST/api/payments/create-orderStudentCreate Razorpay orderPOST/api/payments/verifyStudentVerify payment + enroll
Admin
MethodRouteAccessDescriptionGET/api/admin/usersAdminGet all usersPATCH/api/admin/users/:id/banAdminBan or unban a userPATCH/api/admin/users/:id/roleAdminChange user roleGET/api/admin/statsAdminGet platform stats
Announcements
MethodRouteAccessDescriptionPOST/api/announcementsTeacher/AdminPost an announcementGET/api/announcements/course/:course_idStudentGet course announcementsGET/api/announcementsAdminGet all announcements
Reviews
MethodRouteAccessDescriptionPOST/api/reviewsStudentSubmit a reviewGET/api/reviews/course/:course_idPublicGet course reviews

Database Schema
TablePurposeusersAuth, roles, ban statusprofilesExtended user info (bio, mobile, avatar)coursesCourse catalog owned by teachersmodulesCourse sections with order indexlecturesIndividual video lessonsenrollmentsStudent-course relationshipsprogressPer-lecture watch progresspaymentsRazorpay order and payment recordsannouncementsCourse and platform announcementsreviewsStudent ratings and comments

Getting Started
Prerequisites

Node.js v18+
MySQL 8+
AWS account (S3 bucket)
Razorpay account (test keys)

Backend Setup
bashcd backend
npm install
Create .env:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=eduvora
JWT_SECRET=your_jwt_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret
bashnode app.js
Frontend Setup
bashcd frontend
npm install
Create frontend/.env:
VITE_API_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
bashnpm run dev

Deployment

Frontend — AWS S3 static website hosting
Backend — AWS EC2 with Docker
Database — MySQL on EC2
Videos — AWS S3 bucket (ap-south-1)
SSL — Certbot + Nginx reverse proxy





