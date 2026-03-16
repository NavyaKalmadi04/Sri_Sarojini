import { Router } from 'express';
import { getAllStudents, getStudentById, getStudentByUserId, createStudent, updateStudent, deleteStudent } from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllStudents);
router.get('/me', authenticate, authorize('student'), getStudentByUserId);
router.get('/:id', authenticate, getStudentById);
router.post('/', authenticate, authorize('admin'), createStudent);
router.put('/:id', authenticate, authorize('admin'), updateStudent);
router.delete('/:id', authenticate, authorize('admin'), deleteStudent);

export default router;
