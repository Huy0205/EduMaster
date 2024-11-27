import { Router } from 'express';
import { ResultController } from '~/app/controllers';

const resultRouter = Router();

// GET http://localhost:8080/api/v1/result/user/:userId
resultRouter.get('/user/:userId', ResultController.getResultsByUser);

// GET http://localhost:8080/api/v1/result/user/:userId/quiz/:quizId/max-score
resultRouter.get(
    '/user/:userId/quiz/:quizId/max-score',
    ResultController.getResultByUserAndQuizMaxScore,
);

// GET http://localhost:8080/api/v1/result/user/:userId/quiz/:quizId/latest
resultRouter.get(
    '/user/:userId/quiz/:quizId/latest',
    ResultController.getResultByUserAndQuizLatest,
);

// POST http://localhost:8080/api/v1/result/add
resultRouter.post('/add', ResultController.addResult);

// PUT http://localhost:8080/api/v1/result/update/:resultId
resultRouter.put('/update/:resultId', ResultController.updateResult);

export default resultRouter;
