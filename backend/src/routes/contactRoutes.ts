import { Router } from 'express';
import { submitContact, getContactMessages } from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', submitContact);
router.get('/', authenticate, authorize('admin'), getContactMessages);

export default router;
