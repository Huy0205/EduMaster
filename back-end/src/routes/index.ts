import { Router } from 'express';
import { authentication } from '../middlewares/authentication';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';
import reviewRouter from './reviewRoute';
import questionRouter from './questionRoute';
import answerRouter from './answerRoute';
import lectureRouter from './lectureRoute';
import quizRouter from './quizRoute';

const router = Router();

router.all('*', authentication);

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/topic', topicRouter);
router.use('/review', reviewRouter);
router.use('/question', questionRouter);
router.use('/answer', answerRouter);
router.use('/lecture', lectureRouter);
router.use('/quiz', quizRouter);

export default router;
