import { db } from '../../configs';
import { Theory } from '../../app/models';
import { Role, Status } from '../enums';
import { In } from 'typeorm';

const TheoryRepository = db.AppDataSource.getRepository(Theory);

export class TheoryService {
    /**
     * Get all theories
     * ordered by grade, course name, topic order, lesson order, theory order
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllTheories() {
        try {
            const theories = await TheoryRepository.find({
                where: {
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    lesson: {
                        topic: {
                            course: {
                                grade: 'ASC',
                                name: 'ASC',
                            },
                            orderInCourse: 'ASC',
                        },
                        orderInTopic: 'ASC',
                    },
                    orderInLesson: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get all theories success',
                data: theories,
            };
        } catch (error) {
            console.log('Error getting all theories', error);
            throw error;
        }
    }

    /**
     * Get theories by grade
     * ordered by topic order, lesson order, theory order
     * only for admin
     * @param grade
     * @param page
     * @param limit
     * @returns
     */
    public static async getTheoriesByGrade(grade: number) {
        try {
            const theories = await TheoryRepository.find({
                where: {
                    lesson: {
                        topic: {
                            course: {
                                grade,
                            },
                        },
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    lesson: {
                        topic: {
                            orderInCourse: 'ASC',
                        },
                        orderInTopic: 'ASC',
                    },
                    orderInLesson: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get theories by grade success',
                data: theories,
            };
        } catch (error) {
            console.log('Error getting theories by grade', error);
            throw error;
        }
    }

    /**
     * Get theories by course
     * ordered by topic order, lesson order, theory order
     * paginated by page and limit
     * only for admin
     * @param courseId
     * @param page
     * @param limit
     * @returns
     */
    public static async getTheoriesByCourse(courseId: string) {
        try {
            const theories = await TheoryRepository.find({
                where: {
                    lesson: {
                        topic: {
                            course: {
                                id: courseId,
                            },
                        },
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    lesson: {
                        topic: {
                            orderInCourse: 'ASC',
                        },
                        orderInTopic: 'ASC',
                    },
                    orderInLesson: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get theories by course success',
                data: theories,
            };
        } catch (error) {
            console.log('Error getting theories by course', error);
            throw error;
        }
    }

    /**
     * Get theories by topic
     * ordered by lesson order, theory order
     * paginated by page and limit
     * only for admin
     * @param topicId
     * @param page
     * @param limit
     * @returns
     */
    public static async getTheoriesByTopic(topicId: string) {
        try {
            const theories = await TheoryRepository.find({
                where: {
                    lesson: {
                        topic: {
                            id: topicId,
                        },
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                    orderInLesson: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get theories by topic success',
                data: theories,
            };
        } catch (error) {
            console.log('Error getting theories by topic', error);
            throw error;
        }
    }

    /**
     * Get theories by lesson
     * ordered by theory order
     * @param reviewId
     * @returns
     */
    public static async getTheoriesByLesson(lessonId: string, role: Role) {
        try {
            const response = await TheoryRepository.find({
                where: {
                    lesson: {
                        id: lessonId,
                    },
                    status:
                        role === Role.ADMIN ? In([Status.ACTIVE, Status.INACTIVE]) : Status.ACTIVE,
                },
                order: {
                    orderInLesson: 'ASC',
                },
            });
            return {
                code: 200,
                message: 'Get theories by lesson success',
                data: response,
            };
        } catch (error) {
            console.log('Error getting theories by lesson', error);
            throw error;
        }
    }

    public static async getMaxOrderInLesson(lessonId: string) {
        try {
            const maxOrder = await TheoryRepository.maximum('orderInLesson', {
                lesson: { id: lessonId },
            });
            return {
                code: 200,
                message: 'Get max order in lesson success',
                data: maxOrder,
            };
        } catch (error) {
            console.log('Error getting max order in lesson', error);
            throw error;
        }
    }

    public static async saveTheory(theory: Partial<Theory>) {
        try {
            const savedTheory = await TheoryRepository.save(theory);
            return {
                code: 200,
                message: 'Save theory success',
                data: savedTheory,
            };
        } catch (error) {
            console.log('Error saving theory', error);
            throw error;
        }
    }
}
