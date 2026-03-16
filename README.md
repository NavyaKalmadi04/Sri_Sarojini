# 🏫 Vidya Bharati International School Portal

A full-stack school management portal built with React, Node.js, Express, TypeScript, and PostgreSQL.

## Architecture

```
school-portal/
├── frontend/          # React + TypeScript + Tailwind CSS
│   └── src/
│       ├── components/   # Navbar, Footer, ProtectedRoute
│       ├── context/      # AuthContext (JWT state)
│       ├── pages/        # All page components
│       ├── services/     # API service (axios)
│       └── types/        # TypeScript interfaces
├── backend/           # Node.js + Express + TypeScript
│   └── src/
│       ├── config/       # Database pool (pg)
│       ├── controllers/  # Route handlers
│       ├── middleware/    # JWT auth + role authorization
│       ├── models/       # TypeScript types
│       └── routes/       # Express routers
└── database/          # SQL schema
```

## Prerequisites

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** or **yarn**

## Setup Instructions

### 1. PostgreSQL Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE school_portal;"

# Apply schema (optional — seed script does this too)
psql -U postgres -d school_portal -f database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install

# Configure environment
cp .env .env.local   # Edit DB credentials if needed

# Seed database (creates schema + sample data)
npx ts-node src/seed.ts

# Start development server
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Frontend

```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend runs at **http://localhost:3000**

The Vite dev server proxies `/api/*` requests to the backend automatically.

## Login Credentials

All accounts use password: **`password123`**

| Role    | Email              | Portal               |
|---------|--------------------|-----------------------|
| Admin   | admin@school.com   | /portal/admin         |
| Teacher | priya@school.com   | /portal/teacher       |
| Student | aarav@school.com   | /portal/student       |

Additional accounts: `anand@school.com`, `sunita@school.com` (teachers), `diya@school.com`, `arjun@school.com` (students)

## API Endpoints

### Authentication
| Method | Endpoint           | Description      | Auth |
|--------|--------------------|------------------|------|
| POST   | /api/auth/login    | Login            | No   |
| GET    | /api/auth/profile  | Get profile      | Yes  |

### Students
| Method | Endpoint             | Description       | Auth       |
|--------|----------------------|-------------------|------------|
| GET    | /api/students        | List all          | Yes        |
| GET    | /api/students/me     | Current student   | Student    |
| GET    | /api/students/:id    | Get by ID         | Yes        |
| POST   | /api/students        | Create            | Admin      |
| PUT    | /api/students/:id    | Update            | Admin      |
| DELETE | /api/students/:id    | Delete            | Admin      |

### Teachers
| Method | Endpoint             | Description       | Auth       |
|--------|----------------------|-------------------|------------|
| GET    | /api/teachers        | List all          | Yes        |
| GET    | /api/teachers/me     | Current teacher   | Teacher    |
| GET    | /api/teachers/:id    | Get by ID         | Yes        |
| POST   | /api/teachers        | Create            | Admin      |
| PUT    | /api/teachers/:id    | Update            | Admin      |
| DELETE | /api/teachers/:id    | Delete            | Admin      |

### Marks
| Method | Endpoint       | Query Params                    | Auth          |
|--------|----------------|---------------------------------|---------------|
| GET    | /api/marks     | student_id, exam_type, subject  | Yes           |
| POST   | /api/marks     | —                               | Admin/Teacher |
| PUT    | /api/marks/:id | —                               | Admin/Teacher |
| DELETE | /api/marks/:id | —                               | Admin         |

### Timetable
| Method | Endpoint           | Query Params          | Auth  |
|--------|--------------------|-----------------------|-------|
| GET    | /api/timetable     | class, teacher_id     | Yes   |
| POST   | /api/timetable     | —                     | Admin |
| PUT    | /api/timetable/:id | —                     | Admin |
| DELETE | /api/timetable/:id | —                     | Admin |

### Attendance
| Method | Endpoint             | Description          | Auth          |
|--------|----------------------|----------------------|---------------|
| GET    | /api/attendance      | Get records          | Yes           |
| POST   | /api/attendance      | Mark single          | Admin/Teacher |
| POST   | /api/attendance/bulk | Mark bulk            | Admin/Teacher |

### Contact
| Method | Endpoint      | Description       | Auth  |
|--------|---------------|-------------------|-------|
| POST   | /api/contact  | Submit form       | No    |
| GET    | /api/contact  | View messages     | Admin |

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password123"}'
```

### Get Students (with token)
```bash
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Marks by Student and Exam Type
```bash
curl "http://localhost:5000/api/marks?student_id=1&exam_type=unit1" \
  -H "Authorization: Bearer <token>"
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","phone":"+919876543210","message":"Inquiry about admissions"}'
```

### Mark Bulk Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"records":[{"user_id":3,"role":"student","date":"2026-03-16","status":"present"}]}'
```

## Features

### Public Pages
- **Home** — Scrolling announcements, hero carousel, highlights, stats
- **About** — Founder message, management team, vision & mission
- **Curriculum** — Academics grid, co-curricular activities, facilities
- **Alumni** — Flip cards (desktop grid / mobile scroll)
- **Contact** — Form with backend API integration

### Student Portal
- View weekly timetable
- View marks by exam type (Unit 1, Unit 2, Midterm, Final)
- Attendance record with statistics
- Exam schedule

### Teacher Portal
- Personal timetable
- Class-wise student list
- Mark student attendance (bulk)
- Mark personal attendance

### Admin Portal
- Full CRUD for students, teachers, marks, timetable
- Class-wise data filtering
- Attendance overview for all students and teachers
- Modal-based add/edit forms

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, TypeScript, Tailwind CSS  |
| Routing   | React Router v6                     |
| HTTP      | Axios                               |
| Backend   | Node.js, Express.js, TypeScript     |
| Database  | PostgreSQL with pg driver            |
| Auth      | JWT (jsonwebtoken + bcryptjs)        |
| Build     | Vite                                |
