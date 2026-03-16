import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// Students
export const studentsAPI = {
  getAll: (params?: { class?: string; section?: string }) =>
    api.get('/students', { params }),
  getById: (id: number) => api.get(`/students/${id}`),
  getMe: () => api.get('/students/me'),
  create: (data: any) => api.post('/students', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Teachers
export const teachersAPI = {
  getAll: () => api.get('/teachers'),
  getById: (id: number) => api.get(`/teachers/${id}`),
  getMe: () => api.get('/teachers/me'),
  create: (data: any) => api.post('/teachers', data),
  update: (id: number, data: any) => api.put(`/teachers/${id}`, data),
  delete: (id: number) => api.delete(`/teachers/${id}`),
};

// Marks
export const marksAPI = {
  getAll: (params?: { student_id?: number; exam_type?: string; subject?: string }) =>
    api.get('/marks', { params }),
  create: (data: any) => api.post('/marks', data),
  update: (id: number, data: any) => api.put(`/marks/${id}`, data),
  delete: (id: number) => api.delete(`/marks/${id}`),
};

// Timetable
export const timetableAPI = {
  getAll: (params?: { class?: string; teacher_id?: number }) =>
    api.get('/timetable', { params }),
  create: (data: any) => api.post('/timetable', data),
  update: (id: number, data: any) => api.put(`/timetable/${id}`, data),
  delete: (id: number) => api.delete(`/timetable/${id}`),
};

// Attendance
export const attendanceAPI = {
  getAll: (params?: { user_id?: number; role?: string; date?: string; student_id?: number }) =>
    api.get('/attendance', { params }),
  mark: (data: any) => api.post('/attendance', data),
  bulkMark: (records: any[]) => api.post('/attendance/bulk', { records }),
};

// Contact
export const contactAPI = {
  submit: (data: { name: string; email: string; phone: string; message: string }) =>
    api.post('/contact', data),
  getAll: () => api.get('/contact'),
};

export default api;
