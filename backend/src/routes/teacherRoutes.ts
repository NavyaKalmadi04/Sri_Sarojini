import { Router } from 'express';
import { getAllTeachers, getTeacherById, getTeacherByUserId, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllTeachers);
router.get('/me', authenticate, authorize('teacher'), getTeacherByUserId);
router.get('/:id', authenticate, getTeacherById);
router.post('/', authenticate, authorize('admin'), createTeacher);
router.put('/:id', authenticate, authorize('admin'), updateTeacher);
router.delete('/:id', authenticate, authorize('admin'), deleteTeacher);

export default router;
