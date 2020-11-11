import express from 'express';
import adminRouter from './adminRoutes';
import merchantRouter from './merchantRoutes';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/merchant', merchantRouter);

export default router;
