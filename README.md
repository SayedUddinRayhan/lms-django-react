# LMS Platform - Django React Tailwind

[![Python](https://img.shields.io/badge/Python-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-green?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?logo=vercel)](http://localhost:5173/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-black?logo=github&logoColor=white)](https://github.com/SayedUddinRayhan/lms-django-react)

**LMS Platform** is a modern, full-stack Learning Management System built with **Django REST Framework** (backend), **React** (frontend), and **Tailwind CSS** (styling). It enables instructors to create courses, manage students, and track progress, while learners can enroll, access content, and interact with course materials—all through a responsive, intuitive interface.

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based secure login, registration, and password management
- **Role-Based Access Control**:
  - **Admin**: Full system control, user management, analytics
  - **Instructor**: Create/edit courses, manage enrollments, grade assignments
  - **Student**: Enroll in courses, access lessons, submit assignments, track progress

### 📚 Course Management
- Create, edit, and organize courses with modules, lessons, and resources
- Support for video, text, PDF, and quiz content types
- Rich text editor for course content (TinyMCE/Quill)

### 📊 Learning & Progress
- Visual progress tracking with completion percentages
- Achievement badges and certificates upon course completion
- Assignment submissions with instructor feedback
- Auto-graded quizzes and manual grading options

### 💬 Engagement
- Course-specific discussion forums and Q&A
- Real-time notifications for deadlines, grades, and announcements
- Comment system on lessons and assignments

### 🎨 UI/UX
- Fully responsive design powered by **Tailwind CSS**
- Dark/Light mode toggle
- Intuitive dashboard tailored to each user role
- Search and filter courses by title, category, instructor, or tags

### ⚙️ Developer Features
- RESTful API with Django REST Framework
- Swagger/OpenAPI documentation
- CORS configured for seamless frontend-backend communication
- Environment-based configuration for dev/staging/prod

---

## 📸 Screenshots

| Dashboard | Course List | Course Detail | Student Progress |
|-----------|-------------|---------------|------------------|
| ![Dashboard](screenshots/dashboard.png) | ![Courses](screenshots/courses.png) | ![Course Detail](screenshots/course-detail.png) | ![Progress](screenshots/progress.png) |

> 💡 *Add your actual screenshots to the `screenshots/` folder and update the paths above.*

---

## 👥 Role vs Access Permissions

| Role | Access Features |
|------|----------------|
| **Admin** | Manage all users, courses, site settings; view system-wide analytics; configure platform settings |
| **Instructor** | Create/edit own courses; manage enrollments; grade submissions; view course-specific analytics |
| **Student** | Enroll in courses; access enrolled content; submit assignments; participate in discussions; track personal progress |

---

## 🛠 Tech Stack

### Backend
- **Python 3.10+**, **Django 4.2+**, **Django REST Framework**
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Permissions**: Django Guardian for object-level permissions
- **Email**: SendGrid / SMTP for password reset & notifications
- **Task Queue**: Celery + Redis (optional, for async emails)

### Frontend
- **React 18+** with Vite bundler
- **Tailwind CSS** for utility-first, responsive styling
- **React Router v6** for client-side routing
- **Axios** for API HTTP requests
- **React Hook Form** + **Zod** for form handling & validation
- **Recharts** for dashboard analytics visualization

### DevOps & Tooling
- **Docker** & **Docker Compose** (optional)
- **ESLint** + **Prettier** (frontend), **Black** + **Flake8** (backend)
- **GitHub Actions** for CI/CD pipeline
- **pre-commit hooks** for code quality

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm/yarn/pnpm
- PostgreSQL (recommended for production)

### Step 1: Clone the Repository
```bash
git clone https://github.com/SayedUddinRayhan/lms-django-react.git
cd lms-django-react
