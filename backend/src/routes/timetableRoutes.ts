import { Router } from 'express';
import { getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry } from '../controllers/timetableController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTimetable);
router.post('/', authenticate, authorize('admin'), createTimetableEntry);
router.put('/:id', authenticate, authorize('admin'), updateTimetableEntry);
router.delete('/:id', authenticate, authorize('admin'), deleteTimetableEntry);

export default router;
