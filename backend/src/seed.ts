import pool from './config/database';
import bcrypt from 'bcryptjs';

const schema = `
-- Drop tables if they exist
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(20) NOT NULL,
  section VARCHAR(10) NOT NULL,
  roll_no VARCHAR(20) NOT NULL,
  attendance INTEGER DEFAULT 0,
  fees DECIMAL(10,2) DEFAULT 0
);

-- Teachers table
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  attendance INTEGER DEFAULT 0
);

-- Marks table
CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('unit1', 'unit2', 'midterm', 'final')),
  marks INTEGER NOT NULL CHECK (marks >= 0 AND marks <= 100)
);

-- Timetable table
CREATE TABLE timetable (
  id SERIAL PRIMARY KEY,
  class VARCHAR(20) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(50) NOT NULL
);

-- Attendance table
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  UNIQUE(user_id, date)
);

-- Contact messages table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_exam_type ON marks(exam_type);
CREATE INDEX idx_timetable_class ON timetable(class);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
`;

async function seed() {
  try {
    console.log('🔧 Creating schema...');
    await pool.query(schema);
    console.log('✅ Schema created.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create users
    console.log('👤 Creating users...');
    const adminResult = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ['Dr. Rajesh Kumar', 'admin@school.com', hashedPassword, 'admin']
    );
    const adminId = adminResult.rows[0].id;

    // Teacher users
    const teacherUsers = [
      ['Priya Sharma', 'priya@school.com', 'Mathematics'],
      ['Anand Verma', 'anand@school.com', 'Science'],
      ['Sunita Reddy', 'sunita@school.com', 'English'],
      ['Ramesh Patel', 'ramesh@school.com', 'Social Studies'],
      ['Kavitha Nair', 'kavitha@school.com', 'Hindi'],
    ];

    const teacherIds: { userId: number; teacherId: number; name: string; subject: string }[] = [];
    for (const [name, email, subject] of teacherUsers) {
      const userResult = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'teacher') RETURNING id",
        [name, email, hashedPassword]
      );
      const teacherResult = await pool.query(
        "INSERT INTO teachers (user_id, name, subject, attendance) VALUES ($1, $2, $3, $4) RETURNING id",
        [userResult.rows[0].id, name, subject, Math.floor(Math.random() * 20) + 80]
      );
      teacherIds.push({ userId: userResult.rows[0].id, teacherId: teacherResult.rows[0].id, name: name as string, subject: subject as string });
    }

    // Student users
    const studentData = [
      ['Aarav Mehta', 'aarav@school.com', '10', 'A', '101', 45000],
      ['Diya Singh', 'diya@school.com', '10', 'A', '102', 45000],
      ['Arjun Rao', 'arjun@school.com', '10', 'A', '103', 45000],
      ['Ishaan Gupta', 'ishaan@school.com', '10', 'A', '104', 45000],
      ['Ananya Das', 'ananya@school.com', '10', 'B', '201', 45000],
      ['Vihaan Joshi', 'vihaan@school.com', '10', 'B', '202', 45000],
      ['Saanvi Kulkarni', 'saanvi@school.com', '10', 'B', '203', 45000],
      ['Aditya Thakur', 'aditya@school.com', '10', 'B', '204', 45000],
      ['Myra Kapoor', 'myra@school.com', '9', 'A', '301', 42000],
      ['Reyansh Iyer', 'reyansh@school.com', '9', 'A', '302', 42000],
      ['Kiara Bhat', 'kiara@school.com', '9', 'A', '303', 42000],
      ['Kabir Pandey', 'kabir@school.com', '9', 'B', '401', 42000],
    ];

    const studentIds: { userId: number; studentId: number; name: string; class: string }[] = [];
    for (const [name, email, cls, section, rollNo, fees] of studentData) {
      const userResult = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'student') RETURNING id",
        [name, email, hashedPassword]
      );
      const studentResult = await pool.query(
        "INSERT INTO students (user_id, name, class, section, roll_no, attendance, fees) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [userResult.rows[0].id, name, cls, section, rollNo, Math.floor(Math.random() * 20) + 75, fees]
      );
      studentIds.push({ userId: userResult.rows[0].id, studentId: studentResult.rows[0].id, name: name as string, class: cls as string });
    }

    // Marks
    console.log('📝 Inserting marks...');
    const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'];
    const examTypes = ['unit1', 'unit2', 'midterm', 'final'];

    for (const student of studentIds) {
      for (const subject of subjects) {
        for (const examType of examTypes) {
          const marks = Math.floor(Math.random() * 40) + 60; // 60-100
          await pool.query(
            "INSERT INTO marks (student_id, subject, exam_type, marks) VALUES ($1, $2, $3, $4)",
            [student.studentId, subject, examType, marks]
          );
        }
      }
    }

    // Timetable
    console.log('📅 Creating timetable...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['09:00 - 09:45', '09:45 - 10:30', '10:45 - 11:30', '11:30 - 12:15', '13:00 - 13:45', '13:45 - 14:30'];
    const classes = ['10', '9'];

    for (const cls of classes) {
      for (const day of days) {
        for (let i = 0; i < times.length; i++) {
          const teacherIndex = (i + days.indexOf(day)) % teacherIds.length;
          await pool.query(
            "INSERT INTO timetable (class, subject, teacher_id, day, time) VALUES ($1, $2, $3, $4, $5)",
            [cls, teacherIds[teacherIndex].subject, teacherIds[teacherIndex].teacherId, day, times[i]]
          );
        }
      }
    }

    // Attendance records (last 30 days)
    console.log('📋 Creating attendance records...');
    const today = new Date();
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

      const dateStr = date.toISOString().split('T')[0];

      for (const student of studentIds) {
        const status = Math.random() > 0.1 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late');
        await pool.query(
          "INSERT INTO attendance (user_id, role, date, status) VALUES ($1, 'student', $2, $3) ON CONFLICT (user_id, date) DO NOTHING",
          [student.userId, dateStr, status]
        );
      }

      for (const teacher of teacherIds) {
        const status = Math.random() > 0.05 ? 'present' : 'absent';
        await pool.query(
          "INSERT INTO attendance (user_id, role, date, status) VALUES ($1, 'teacher', $2, $3) ON CONFLICT (user_id, date) DO NOTHING",
          [teacher.userId, dateStr, status]
        );
      }
    }

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📧 Login Credentials (password: password123 for all):');
    console.log('   Admin:   admin@school.com');
    console.log('   Teacher: priya@school.com');
    console.log('   Student: aarav@school.com');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
