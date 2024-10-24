import { db } from '~/configs';
import { Topic } from '~/app/models';

const TopicRepository = db.AppDataSource.getRepository(Topic);

export class TopicService {
  static async getTopicsByCourse(courseId: string) {
    try {
      const topics = await TopicRepository.find({
        where: {
          course: {
            id: courseId,
          },
        },
        relations: ['course'],
      });
      return {
        code: 200,
        message: 'Get topics success',
        data: topics,
      };
    } catch (error) {
      console.log('Error getting topics', error);
      throw error;
    }
  }
}
