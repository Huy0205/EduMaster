import { db } from '../../configs';
import { Practice } from '../../app/models';
import { In } from 'typeorm';
import { Role, Status } from '../enums';

const PracticeRepository = db.AppDataSource.getRepository(Practice);

export class PracticeService {
    public static async getAllPractices() {
        try {
            const practices = await PracticeRepository.find({
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
                message: 'Get all practices successfully',
                data: practices,
            };
        } catch (error) {
            console.error('Error getting all practices', error);
            throw error;
        }
    }

    public static async countAllPractices() {
        try {
            const count = await PracticeRepository.count({
                where: {
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
            });
            return {
                code: 200,
                message: 'Count all practices successfully',
                data: count,
            };
        } catch (error) {
            console.error('Error counting all practices', error);
            throw error;
        }
    }

    public static async getPracticesByGrade(grade: number) {
        try {
            const practices = await PracticeRepository.find({
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
                            course: {
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
                message: 'Get practices by grade successfully',
                data: practices,
            };
        } catch (error) {
            console.error('Error getting practices by grade', error);
            throw error;
        }
    }

    public static async getPracticesByCourse(courseId: string) {
        try {
            const practices = await PracticeRepository.find({
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
                message: 'Get practices by course successfully',
                data: practices,
            };
        } catch (error) {
            console.error('Error getting practices by course', error);
            throw error;
        }
    }

    public static async getPracticesByTopic(topicId: string) {
        try {
            const practices = await PracticeRepository.find({
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
                message: 'Get practices by topic successfully',
                data: practices,
            };
        } catch (error) {
            console.error('Error getting practices by topic', error);
            throw error;
        }
    }

    /**
     * Get practices by lesson id
     * @param lessonId
     * @returns
     */
    public static async getPracticesByLesson(lessonId: string, role: Role) {
        try {
            const practices = await PracticeRepository.find({
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
                message: 'Get practices by lesson successfully',
                data: practices,
            };
        } catch (error) {
            console.error('Error getting practices by lesson', error);
            throw error;
        }
    }

    public static async getMaxOrderInLesson(lessonId: string) {
        try {
            const max = await PracticeRepository.maximum('orderInLesson', {
                lesson: {
                    id: lessonId,
                },
            });
            return {
                code: 200,
                message: 'Get max order in lesson successfully',
                data: max,
            };
        } catch (error) {
            console.error('Error getting max order in lesson', error);
            throw error;
        }
    }

    /**
     * Save practice
     * @param practice
     * @returns
     */
    public static async savePractice(practice: Partial<Practice>) {
        try {
            const newPractice = await PracticeRepository.save(practice);
            return {
                code: 200,
                message: 'Save practice successfully',
                data: newPractice,
            };
        } catch (error) {
            console.error('Error saving practice', error);
            throw error;
        }
    }
}
