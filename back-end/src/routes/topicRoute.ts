import { Router } from 'express';
import { TopicController } from '~/app/controllers';

const topicRouter = Router();

topicRouter.get('/', (req, res) => {
  res.send('Topic Route');
});

// GET: localhost:8080/api/v1/topic/course/1
topicRouter.get('/course/:courseId', TopicController.getTopicsByCourse);

export default topicRouter;
