import { Router } from 'express';
import { QuestionController } from '~/app/controllers';

const questionRouter = Router();

questionRouter.get('/', (req, res) => {
    res.send('Question Route');
});

// GET: localhost:8080/api/v1/question/review/1
questionRouter.get('/review/:reviewId', QuestionController.getQuestionsByReview);

// POST: localhost:8080/api/v1/question/add
questionRouter.post('/add', QuestionController.addQuestion);

export default questionRouter;
