import { db } from '~/configs';
import { Topic } from '~/app/models';
import { Role, Status } from '../enums';
import { In } from 'typeorm';

const TopicRepository = db.AppDataSource.getRepository(Topic);

interface AdminData {
    id: string;
    name: string;
    orderInCourse: number;
    status: Status;
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
     * Get all topics, order by course grade and name, topic order
     * paginated
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllTopics(page: number, limit: number) {
        try {
            const [topics, total] = await TopicRepository.findAndCount({
                relations: ['course'],
                select: {
                    id: true,
                    name: true,
                    orderInCourse: true,
                    status: true,
                    course: {
                        name: true,
                        grade: true,
                    },
                },
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
                skip: (page - 1) * limit,
                take: limit,
            });
            const result = topics.map((item) => {
                const topic = {
                    id: item.id,
                    name: item.name,
                    courseName: item.course.name,
                    grade: item.course.grade,
                    status: item.status,
                };
                return topic;
            });
            return {
                code: 200,
                message: 'Get all topics success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: result,
                },
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
    public static async getTopicByGrade(grade: number, page: number, limit: number) {
        try {
            const topics = await TopicRepository.find({
                relations: ['course'],
                select: {
                    id: true,
                    name: true,
                    orderInCourse: true,
                    status: true,
                    course: {
                        name: true,
                        grade: true,
                    },
                },
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
                skip: (page - 1) * limit,
                take: limit,
            });

            const result = topics.map((item) => {
                const topic = {
                    id: item.id,
                    name: item.name,
                    courseName: item.course.name,
                    grade: item.course.grade,
                    status: item.status,
                };
                return topic;
            });
            return {
                code: 200,
                message: 'Get topics by grade success',
                data: {
                    totalPage: Math.ceil(topics.length / limit),
                    list: result,
                },
            };
        } catch (error) {
            console.log('Error getting topics by grade', error);
            throw error;
        }
    }

    public static async getTopicsByCourse(
        courseId: string,
        role: number,
        page: number,
        limit: number,
    ) {
        try {
            const [topics, total] = await TopicRepository.findAndCount({
                relations: role === Role.ADMIN ? ['course'] : [],
                select:
                    role === 0
                        ? {
                              id: true,
                              name: true,
                              orderInCourse: true,
                              course: {
                                  name: true,
                                  grade: true,
                              },
                          }
                        : {
                              id: true,
                              name: true,
                              orderInCourse: true,
                          },
                where: {
                    course: {
                        id: courseId,
                    },
                    status:
                        role === Role.ADMIN ? In([Status.ACTIVE, Status.INACTIVE]) : Status.ACTIVE,
                },
                order:
                    role === Role.ADMIN
                        ? {
                              course: {
                                  grade: 'ASC',
                                  name: 'ASC',
                              },
                              orderInCourse: 'ASC',
                          }
                        : {
                              orderInCourse: 'ASC',
                          },
                skip: (page - 1) * limit,
                take: limit,
            });
            const result = topics.map((item) => {
                const topic = {
                    id: item.id,
                    name: item.name,
                };
                if (role === Role.ADMIN) {
                    topic['courseId'] = item.course.id;
                    topic['courseName'] = item.course.name;
                    topic['grade'] = item.course.grade;
                    topic['status'] = item.status;
                } else {
                    topic['orderInCourse'] = item.orderInCourse;
                }
                return topic;
            });
            return {
                code: 200,
                message: 'Get topics by course success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: result,
                },
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
    public static async addTopic(topic: Partial<Topic>) {
        console.log('Adding topic', topic);
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

    public static async updateStatus(topicId: string, status: Status) {
        try {
            await TopicRepository.update(topicId, { status });
            return {
                code: 200,
                message: 'Update topic status success',
            };
        } catch (error) {
            console.log('Error updating topic status', error);
            throw error;
        }
    }
}
