import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/topic', topicRouter);

export default router;
