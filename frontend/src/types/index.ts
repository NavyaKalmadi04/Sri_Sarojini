export type Role = 'admin' | 'teacher' | 'student';
export type ExamType = 'unit1' | 'unit2' | 'midterm' | 'final';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  roleId?: number | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
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

export interface Mark {
  id: number;
  student_id: number;
  student_name?: string;
  class?: string;
  section?: string;
  subject: string;
  exam_type: ExamType;
  marks: number;
}

export interface TimetableEntry {
  id: number;
  class: string;
  subject: string;
  teacher_id: number;
  teacher_name?: string;
  day: string;
  time: string;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  role: Role;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Alumni {
  id: number;
  name: string;
  batch: string;
  profession: string;
  location: string;
  message: string;
  photo: string;
}
