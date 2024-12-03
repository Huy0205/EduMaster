import { Router } from 'express';
import userRouter from './userRoute';
import courseRouter from './courseRoute';
import topicRouter from './topicRoute';
import questionRouter from './questionRoute';
import answerRouter from './answerRoute';
import theoryRouter from './theoryRoute';
import quizRouter from './quizRoute';
import quizQuestionRouter from './quizQuestionRoute';
import lessonRouter from './lessonRoute';
import avatarFrameRouter from './avatarFrameRoute';
import avatarFrameUserRouter from './avatarFrameUserRoute';
import practiceRouter from './practiceRoute';
import resultRouter from './resultRoute';
import enrollmentRouter from './enrollmentRoute';
import practiceProgressRouter from './practiceProgressRoute';

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
router.use('/avatar-frame', avatarFrameRouter);
router.use('/avatar-frame-user', avatarFrameUserRouter);
router.use('/practice', practiceRouter);
router.use('/result', resultRouter);
router.use('/enrollment', enrollmentRouter);
router.use('/practice-progress', practiceProgressRouter);

export default router;
