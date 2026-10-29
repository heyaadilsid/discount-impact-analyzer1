import express from 'express';
import {
  getScenario,
  saveScenario
} from '../controllers/scenarioController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All scenario routes require authentication

router.route('/')
  .get(getScenario)
  .put(saveScenario);

export default router;
