import { db } from '../../configs';
import { Topic } from '../../app/models';
import { Role, Status } from '../enums';
import { In } from 'typeorm';

const TopicRepository = db.AppDataSource.getRepository(Topic);

export class TopicService {
    /**
     * Get all topics, order by course grade and name, topic order
     * paginated
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllTopics() {
        try {
            const topics = await TopicRepository.find({
                where: {
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    course: {
                        grade: 'ASC',
                        name: 'ASC',
                    },
                    orderInCourse: 'ASC',
                },
            });
            return {
                code: 200,
                message: 'Get all topics success',
                data: topics,
            };
        } catch (error) {
            console.log('Error getting all topics', error);
            throw error;
        }
    }

    /**
     * Get topics by grade, order by course name, topic order
     * paginated
     * only for admin
     * @param grade
     * @param page
     * @param limit
     * @returns
     */
    public static async getTopicByGrade(grade: number) {
        try {
            const topics = await TopicRepository.find({
                where: {
                    course: {
                        grade,
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    course: {
                        grade: 'ASC',
                        name: 'ASC',
                    },
                    orderInCourse: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get topics by grade success',
                data: topics,
            };
        } catch (error) {
            console.log('Error getting topics by grade', error);
            throw error;
        }
    }

    public static async getTopicsByCourse(courseId: string, role: number) {
        try {
            const topics = await TopicRepository.find({
                where: {
                    course: {
                        id: courseId,
                    },
                    status:
                        role === Role.ADMIN ? In([Status.ACTIVE, Status.INACTIVE]) : Status.ACTIVE,
                },
                order: { orderInCourse: 'ASC' },
            });
            return {
                code: 200,
                message: 'Get topics by course success',
                data: topics,
            };
        } catch (error) {
            console.log('Error getting topics', error);
            throw error;
        }
    }

    public static async getTopicById(topicId: string) {
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
     * Get max order in course
     * @param courseId
     * @returns
     */
    public static async getMaxOrderInCourse(courseId: string) {
        try {
            const maxOrder = await TopicRepository.maximum('orderInCourse', {
                course: { id: courseId },
            });
            return {
                code: 200,
                message: 'Get max order in course success',
                data: maxOrder,
            };
        } catch (error) {
            console.log('Error getting max order in course', error);
            throw error;
        }
    }

    /**
     * Add new topic
     * @param topic
     * @returns
     */
    public static async saveTopic(topic: Partial<Topic>) {
        try {
            const savedTopic = await TopicRepository.save(topic);
            return {
                code: 200,
                message: 'Save topic success',
                data: savedTopic,
            };
        } catch (error) {
            console.log('Error saving topic', error);
            throw error;
        }
    }
}
