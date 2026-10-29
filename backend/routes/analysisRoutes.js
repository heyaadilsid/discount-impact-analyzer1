import express from 'express';
import {
  getAnalyses,
  createAnalysis,
  updateAnalysis,
  deleteAnalysis,
  resetDefaultAnalyses
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All analysis routes require authentication

router.route('/')
  .get(getAnalyses)
  .post(createAnalysis);

router.post('/reset', resetDefaultAnalyses);

router.route('/:id')
  .put(updateAnalysis)
  .delete(deleteAnalysis);

export default router;
