import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';
import reviewRouter from './reviewRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/topic', topicRouter);
router.use('/review', reviewRouter);

export default router;
