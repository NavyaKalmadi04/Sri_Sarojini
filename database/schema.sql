-- ============================================
-- Vidya Bharati School Portal - Database Schema
-- PostgreSQL
-- ============================================

-- Create the database (run this separately)
-- CREATE DATABASE school_portal;

-- Drop existing tables
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STUDENTS TABLE
-- ============================================
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

-- ============================================
-- TEACHERS TABLE
-- ============================================
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  attendance INTEGER DEFAULT 0
);

-- ============================================
-- MARKS TABLE
-- ============================================
CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('unit1', 'unit2', 'midterm', 'final')),
  marks INTEGER NOT NULL CHECK (marks >= 0 AND marks <= 100)
);

-- ============================================
-- TIMETABLE TABLE
-- ============================================
CREATE TABLE timetable (
  id SERIAL PRIMARY KEY,
  class VARCHAR(20) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(50) NOT NULL
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  UNIQUE(user_id, date)
);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_exam_type ON marks(exam_type);
CREATE INDEX idx_timetable_class ON timetable(class);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
