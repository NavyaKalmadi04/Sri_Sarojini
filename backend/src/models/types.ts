export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at?: Date;
}

export interface Student {
  id: number;
  user_id: number;
  name: string;
  class: string;
  section: string;
  roll_no: string;
  attendance: number;
  fees: number;
}

export interface Teacher {
  id: number;
  user_id: number;
  name: string;
  subject: string;
  attendance: number;
}

export type ExamType = 'unit1' | 'unit2' | 'midterm' | 'final';

export interface Mark {
  id: number;
  student_id: number;
  subject: string;
  exam_type: ExamType;
  marks: number;
}

export interface Timetable {
  id: number;
  class: string;
  subject: string;
  teacher_id: number;
  day: string;
  time: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at?: Date;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  role: Role;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
  name: string;
}
