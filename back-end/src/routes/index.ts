import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';
import reviewRouter from './reviewRoute';
import questionRouter from './questionRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/topic', topicRouter);
router.use('/review', reviewRouter);
router.use('/question', questionRouter);

export default router;
