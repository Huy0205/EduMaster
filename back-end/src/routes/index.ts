import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);

export default router;
