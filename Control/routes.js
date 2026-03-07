import express from 'express';
import studentRouter from './Student_api.js';

const router = express.Router();

router.use('/', studentRouter);

export default router;