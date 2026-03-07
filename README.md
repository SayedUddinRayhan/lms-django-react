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
- **Flexible Login**: Sign in with **email OR phone number** 📱✉️
- JWT-based secure authentication, registration, and password management
- **Role-Based Access Control**:
  - **Admin**: Full system control, user management, analytics
  - **Instructor**: Create/edit courses, manage modules and lessons
  - **Student**: Enroll in courses, access lessons, track progress

### 📚 Course Management
- Create, edit, and organize courses with modules, lessons, and resources
- Support for video and text content types

### 📊 Learning & Progress
- Visual progress tracking with completion percentages

### 💬 User Feedback & Notifications
- Real-time toast notifications for actions (success, error, warning, info) using **React Hot Toast** 🍞

### 🎨 UI/UX
- Fully responsive design powered by **Tailwind CSS**
- Dark/Light mode toggle
- Intuitive dashboard tailored to each user role


### ⚙️ Developer Features
- RESTful API with Django REST Framework
- CORS configured for seamless frontend-backend communication
- Environment-based configuration for dev/prod

---

## 🎮 Quick Start – Demo Accounts

> ⚠️ **For testing only** 

| Role | Email / Phone | Password | Access |
|------|--------------|----------|--------|
| **Student** | `student@gmail.com` | `test@123` | Enroll, view courses, track progress |
| **Instructor** | `instructor@gmail.com` | `test@123` | Create courses, manage modules & lessons |


🔹 **Login with either email OR phone number** – both are supported!  
🔹 Visit: [http://localhost:5173/login](http://localhost:5173/login)

---

## 📸 Screenshots

| Dashboard | Course List | Course Detail | Student Progress |
|-----------|-------------|---------------|------------------|
| ![Dashboard](screenshots/dashboard.png) | ![Courses](screenshots/courses.png) | ![Course Detail](screenshots/course-detail.png) | ![Progress](screenshots/progress.png) |


---

## 👥 Role vs Access Permissions

| Role | Access Features |
|------|----------------|
| **Admin** | Manage all users, courses, site settings; view system-wide analytics; configure platform settings |
| **Instructor** | Create/edit own courses; manage modules & lessons; view enrolled students |
| **Student** | Enroll in courses; access enrolled content; track personal progress; receive notifications |

---

## 🛠 Tech Stack

### Backend
- **Python 3.10+**, **Django 4.2+**, **Django REST Framework**
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT (`djangorestframework-simplejwt`) + Custom Phone/Email Backend
- **Permissions**: Role-based using Django Groups and Permissions

### Frontend
- **React 18+** with Vite
- **Tailwind CSS** for utility-first, responsive styling
- **React Router v6** for client-side routing
- **Axios** for API HTTP requests
- **React Hook Form** + **Zod** for form handling & validation
- **Recharts** for dashboard analytics visualization
- **React Hot Toast** for elegant, non-intrusive user notifications

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm/yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/SayedUddinRayhan/lms-django-react.git
cd lms-django-react
