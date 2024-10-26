import express from 'express';
import SummaryController from '../controllers/summaryController.js';

const router = express.Router();

router.post('/summary', SummaryController.createJob);
router.get('/summary/:id', SummaryController.getJob);

export default router;
