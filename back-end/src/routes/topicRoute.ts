import { Router } from 'express';
import { TopicController } from '~/app/controllers';

const topicRouter = Router();

// GET: localhost:8080/api/v1/topic/course/:courseId
topicRouter.get('/course/:courseId', TopicController.getTopicsByCourse);

// GET: localhost:8080/api/v1/topic/:id
topicRouter.get('/:id', TopicController.getTopicById);

// POST: localhost:8080/api/v1/topic/add
topicRouter.post('/add', TopicController.addTopic);

export default topicRouter;
