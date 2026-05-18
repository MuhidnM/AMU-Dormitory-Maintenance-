import express from 'express';
import { getStats, getStaffPerformance } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import cacheMiddleware from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/performance', getStaffPerformance);

export default router;

