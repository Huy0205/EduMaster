import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';
import reviewRouter from './reviewRoute';
import questionRouter from './questionRoute';
import answerRouter from './answerRoute';
import lectureRouter from './lectureRoute';
import quizRouter from './quizRoute';
import quizQuestionRouter from './quiz_questionRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/topic', topicRouter);
router.use('/review', reviewRouter);
router.use('/question', questionRouter);
router.use('/answer', answerRouter);
router.use('/lecture', lectureRouter);
router.use('/quiz', quizRouter);
router.use('/quiz-question', quizQuestionRouter);

export default router;
