import express from 'express';
import adminRouter from './adminRoutes';

const router = express.Router();

router.use('/admin', adminRouter);

export default router;
