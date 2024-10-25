
import express from 'express';
import { updateJobStatus } from '../controllers/jobstatusController.js';
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.route('/:jobId/status')
  .put(protect, updateJobStatus);

export default router;
