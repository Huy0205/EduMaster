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

    static async getTopicById(topicId: string) {
        try {
            const topic = await TopicRepository.findOne({
                where: {
                    id: topicId,
                },
            });
            return {
                code: 200,
                message: 'Get topic success',
                data: topic,
            };
        } catch (error) {
            console.log('Error getting topic', error);
            throw error;
        }
    }

    /**
     * Set order for topic by course from position to end
     * @param courseId
     * @param position
     */
    static async setOrderForTopicByCourse(courseId: string, position: number) {
        try {
            const topics = await TopicRepository.find({
                where: {
                    course: {
                        id: courseId,
                    },
                },
                order: {
                    order: 'ASC',
                },
            });
            topics.forEach(async (topic) => {
                if (topic.order >= position) {
                    topic.order += 1;
                    await TopicRepository.save(topic);
                }
            });
        } catch (error) {
            console.log('Error setting order for topic by course', error);
            throw error;
        }
    }

    /**
     * Count topics by course
     * @param courseId
     * @returns
     */
    static async countTopicsByCourse(courseId: string) {
        try {
            const count = await TopicRepository.count({
                where: {
                    course: {
                        id: courseId,
                    },
                },
            });
            return {
                code: 200,
                message: 'Count topics by course success',
                data: count,
            };
        } catch (error) {
            console.log('Error counting topics by course', error);
            throw error;
        }
    }

    /**
     * Add new topic
     * @param topic
     * @returns
     */
    static async addTopic(topic: Partial<Topic>) {
        try {
            const newTopic = await TopicRepository.save(topic);
            return {
                code: 200,
                message: 'Add topic success',
                data: newTopic,
            };
        } catch (error) {
            console.log('Error adding topic', error);
            throw error;
        }
    }
}
