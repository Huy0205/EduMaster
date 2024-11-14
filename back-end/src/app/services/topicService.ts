import { db } from '~/configs';
import { Topic } from '~/app/models';

const TopicRepository = db.AppDataSource.getRepository(Topic);
const columSelect: string[] = ['topic.id', 'topic.name', 'topic.order'];

export class TopicService {
    static async getTopicsByCourse(courseId: string, role: number) {
        try {
            const queryBuilder = TopicRepository.createQueryBuilder('topic')
                .where('topic.course.id = :courseId', { courseId })
                .orderBy('topic.order', 'ASC');
            if (role === 0) {
                queryBuilder
                    .select([...columSelect, 'course.id', 'course.name', 'course.grade'])
                    .innerJoin('topic.course', 'course');
            } else {
                queryBuilder.select(columSelect);
            }
            const topics = await queryBuilder.getMany();
            const result = topics.map((topic) => {
                const data = {
                    id: topic.id,
                    name: topic.name,
                    order: topic.order,
                };
                if (role === 0) {
                    data['courseId'] = topic.course.id;
                    data['courseName'] = topic.course.name;
                    data['grade'] = topic.course.grade;
                }
                return data;
            });
            return {
                code: 200,
                message: 'Get topics by course success',
                data: result,
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

    /**
     * Get topics by grade, used for admin
     * @param grade
     * @returns
     */
    static async getTopicByGrade(grade: number) {
        try {
            const topics = await TopicRepository.createQueryBuilder('topic')
                .select([...columSelect, 'course.id', 'course.name', 'course.grade'])
                .innerJoin('topic.course', 'course')
                .where('course.grade = :grade', { grade })
                .orderBy('topic.order', 'ASC')
                .getMany();
            const result = topics.map((topic) => {
                return {
                    id: topic.id,
                    name: topic.name,
                    order: topic.order,
                    courseId: topic.course.id,
                    courseName: topic.course.name,
                    grade: topic.course.grade,
                };
            });
            return {
                code: 200,
                message: 'Get topics by grade success',
                data: result,
            };
        } catch (error) {
            console.log('Error getting topics by grade', error);
            throw error;
        }
    }
}
