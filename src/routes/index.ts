import express from 'express';
import adminRouter from './adminRoutes';
import merchantRouter from './merchantRoutes';
import shopRouter from './shopRoutes';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/merchant', merchantRouter);
router.use('/shop', shopRouter);

export default router;
