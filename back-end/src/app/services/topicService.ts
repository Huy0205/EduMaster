import { db } from '~/configs';
import { Topic } from '~/app/models';

const TopicRepository = db.AppDataSource.getRepository(Topic);
const columnSelect: string[] = ['topic.id', 'topic.name', 'topic.order'];

interface AdminData {
    id: string;
    name: string;
    orderInCourse: number;
    course: {
        id: string;
        name: string;
        grade: number;
    };
}

export class TopicService {
    /**
     * Convert data to format for admin
     * @param data
     * @returns
     */
    private static convertData(data: AdminData[], role?: number) {
        const result = data.map((item: AdminData) => {
            const topic = {
                id: item.id,
                name: item.name,
                order: item.orderInCourse,
            };
            if (role === 0) {
                topic['courseId'] = item.course.id;
                topic['courseName'] = item.course.name;
                topic['grade'] = item.course.grade;
            }
            return topic;
        });
        return result;
    }

    /**
     * Get all topics, used for admin
     * @returns
     */
    public static async getAllTopics() {
        try {
            const topics = await TopicRepository.createQueryBuilder('topic')
                .select([...columnSelect, 'course.id', 'course.name', 'course.grade'])
                .innerJoin('topic.course', 'course')
                .orderBy('course.grade', 'ASC')
                .orderBy('course.name', 'ASC')
                .orderBy('topic.orderInCourse', 'ASC')
                .getMany();
            const result = this.convertData(topics, 0);
            return {
                code: 200,
                message: 'Get all topics success',
                data: result,
            };
        } catch (error) {
            console.log('Error getting all topics', error);
            throw error;
        }
    }

    public static async getTopicsByCourse(courseId: string, role: number) {
        try {
            const queryBuilder = TopicRepository.createQueryBuilder('topic')
                .where('topic.course.id = :courseId', { courseId })
                .orderBy('topic.order', 'ASC');
            if (role === 0) {
                queryBuilder
                    .select([...columnSelect, 'course.id', 'course.name', 'course.grade'])
                    .innerJoin('topic.course', 'course');
            } else {
                queryBuilder.select(columnSelect);
            }
            const topics = await queryBuilder.getMany();
            const result = this.convertData(topics, role);
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

    /**
     * Get topics by grade, used for admin
     * @param grade
     * @returns
     */
    public static async getTopicByGrade(grade: number) {
        try {
            const topics = await TopicRepository.createQueryBuilder('topic')
                .select([...columnSelect, 'course.id', 'course.name', 'course.grade'])
                .innerJoin('topic.course', 'course')
                .where('course.grade = :grade', { grade })
                .orderBy('topic.order', 'ASC')
                .getMany();
            const result = this.convertData(topics, 0);
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
     * Set order for topic by course from position to end
     * @param courseId
     * @param position
     */
    public static async setOrderForTopicByCourse(courseId: string, position: number) {
        try {
            const topics = await TopicRepository.find({
                where: {
                    course: {
                        id: courseId,
                    },
                },
                order: {
                    orderInCourse: 'ASC',
                },
            });
            topics.forEach(async (topic) => {
                if (topic.orderInCourse >= position) {
                    topic.orderInCourse += 1;
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
    public static async countTopicsByCourse(courseId: string) {
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
    public static async addTopic(topic: Partial<Topic>) {
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
