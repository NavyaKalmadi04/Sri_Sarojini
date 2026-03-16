import { Router } from 'express';
import { getMarks, createMark, updateMark, deleteMark } from '../controllers/marksController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMarks);
router.post('/', authenticate, authorize('admin', 'teacher'), createMark);
router.put('/:id', authenticate, authorize('admin', 'teacher'), updateMark);
router.delete('/:id', authenticate, authorize('admin'), deleteMark);

export default router;
