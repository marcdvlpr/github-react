import express from 'express';
import adminRouter from './adminRoutes';
import merchantRouter from './merchantRoutes';
import shopRouter from './shopRoutes';
import customerRouter from './customerRoutes';
import deliverRouter from './deliverRoutes';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/merchant', merchantRouter);
router.use('/shop', shopRouter);
router.use('/user', customerRouter);
router.use('/deliver', deliverRouter);

export default router;
