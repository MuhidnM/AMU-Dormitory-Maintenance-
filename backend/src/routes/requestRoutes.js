import express from 'express';
import { createRequest, getRequests, assignRequest, updateStatus } from '../controllers/requestController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../utils/upload.js';
import { processImages } from '../middlewares/imageProcessor.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.array('images', 5), processImages, createRequest);
router.get('/', getRequests);
router.patch('/:requestId/assign', authorize('ADMIN'), assignRequest);
router.patch('/:requestId/status', authorize('STAFF', 'ADMIN'), updateStatus);

export default router;

