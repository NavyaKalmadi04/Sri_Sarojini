import { Router } from 'express';
import { getAttendance, markAttendance, bulkMarkAttendance } from '../controllers/attendanceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAttendance);
router.post('/', authenticate, authorize('admin', 'teacher'), markAttendance);
router.post('/bulk', authenticate, authorize('admin', 'teacher'), bulkMarkAttendance);

export default router;
