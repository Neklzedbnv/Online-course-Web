Skilled — Online Courses Platform

Skilled is a full-stack online learning platform where users can browse courses, enroll, watch lessons, and manage their learning progress.
Admins can manage courses and lessons through a protected admin panel.

🚀 Project Overview

Main features:

User authentication (register / login)

Browse courses by category

View course details and lessons

Enroll in courses

“My Courses” page for enrolled users

Admin panel (admin-only access)

YouTube video integration for lessons

Tech stack:

Frontend: HTML, CSS, Vanilla JavaScript

Backend: Node.js, Express.js

Database: MongoDB

Auth: JWT (JSON Web Tokens)

🛠️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME

2️⃣ Install dependencies
npm install

3️⃣ Environment variables

Create a .env file in the backend root:

PORT=3000
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string

4️⃣ Run the project locally
npm start


The app will be available at:

http://localhost:3000

📁 Project Structure
project/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── app.js
│
├── frontend/
│   ├── pages/
│   ├── js/
│   └── css/
│
└── README.md

🔐 Authentication & Roles
Role	Permissions
User	Browse courses, enroll, watch lessons
Admin	Manage courses & lessons

Unauthorized users attempting to access admin pages will see “Permission denied”.

📡 API Documentation
Auth
Register
POST /api/auth/register


Body:

{
  "email": "user@example.com",
  "password": "password123"
}

Login
POST /api/auth/login

Courses
Get all courses
GET /api/courses

Get course by ID
GET /api/courses/:id

Lessons
Get lessons by course
GET /api/lessons/by-course/:courseId

Enrollments
Enroll in course
POST /api/enroll/:courseId
Authorization: Bearer <token>

My courses
GET /api/enroll/my
Authorization: Bearer <token>

🖼️ Screenshots & Features
🏠 Home Page

Description: Landing page with navigation and featured courses.
<img width="900" height="710" alt="Снимок экрана 2026-02-09 в 00 21 24" src="https://github.com/user-attachments/assets/7b30e9a9-fcdc-47c5-8d41-2473b315a75d" />

📚 Courses Page

Description: Browse all courses with filters by category and sorting.
📸 screenshots/courses.png

📖 Course Details Page

Description: Course info, pricing, and lesson list with video preview.
📸 screenshots/course-details.png

🎬 Lesson Video Player

Description: Embedded YouTube videos with smooth in-page playback.
📸 screenshots/lesson-video.png

🎓 My Courses

Description: Displays all courses the user is enrolled in.
📸 screenshots/my-courses.png

🔐 Admin Panel

Description: Admin-only page to manage courses and lessons.
📸 screenshots/admin.png
