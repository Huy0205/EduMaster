import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';
import questionRouter from './questionRoute';
import answerRouter from './answerRoute';
import theoryRouter from './theoryRoute';
import quizRouter from './quizRoute';
import quizQuestionRouter from './quiz_questionRoute';
import lessonRouter from './lessonRoute';

const router = Router();

router.use('/answer', answerRouter);
router.use('/course', courseRouter);
router.use('/theory', theoryRouter);
router.use('/lesson', lessonRouter);
router.use('/user', userRouter);
router.use('/topic', topicRouter);
router.use('/question', questionRouter);
router.use('/quiz', quizRouter);
router.use('/quiz-question', quizQuestionRouter);

export default router;
