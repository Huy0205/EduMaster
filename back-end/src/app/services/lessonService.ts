import { db } from '~/configs';
import { Lesson } from '~/app/models';
import { Role, Status } from '../enums';
import { In } from 'typeorm';

const LessonRepository = db.AppDataSource.getRepository(Lesson);

export class LessonService {
    /**
     * Get all lessons
     * ordered by grade, course name, topic order, lesson order
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllLessons() {
        try {
            const lessons = await LessonRepository.find({
                where: {
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    topic: {
                        course: {
                            grade: 'ASC',
                            name: 'ASC',
                        },
                        orderInCourse: 'ASC',
                    },
                    orderInTopic: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get lessons success',
                data: lessons,
            };
        } catch (error) {
            console.log('Error getting lessons', error);
            throw error;
        }
    }

    public static async getLessonsByGrade(grade: number) {
        try {
            const lessons = await LessonRepository.find({
                where: {
                    topic: { course: { grade } },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    topic: {
                        orderInCourse: 'ASC',
                    },
                    orderInTopic: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get lessons by grade success',
                data: lessons,
            };
        } catch (error) {
            console.log('Error getting lessons by grade', error);
            throw error;
        }
    }

    /**
     * Get lessons by course
     * ordered by topic order in course, lesson order in topic
     * only for admin
     * @param courseId
     * @param page
     * @param limit
     * @returns
     */
    public static async getLessonsByCourse(courseId: string) {
        try {
            const lessons = await LessonRepository.find({
                where: {
                    topic: {
                        course: {
                            id: courseId,
                        },
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    topic: {
                        orderInCourse: 'ASC',
                    },
                    orderInTopic: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get lessons by course success',
                data: lessons,
            };
        } catch (error) {
            console.log('Error getting lessons by course', error);
            throw error;
        }
    }

    /**
     * Get lessons by topic id
     * ordered by lesson order in topic
     * for both admin and user
     * @param topicId
     * @param role
     * @param page
     * @param limit
     * @returns
     */
    public static async getLessonsByTopic(topicId: string, role: Role) {
        try {
            const lessons = await LessonRepository.find({
                where: {
                    topic: {
                        id: topicId,
                    },
                    status:
                        role === Role.ADMIN ? In([Status.ACTIVE, Status.INACTIVE]) : Status.ACTIVE,
                },
                order: {
                    orderInTopic: 'ASC',
                },
            });
            return {
                code: 200,
                message: 'Get lessons by topic success',
                data: lessons,
            };
        } catch (error) {
            console.log('Error getting lessons by topic', error);
            throw error;
        }
    }

    /**
     * Get lesson by id
     * @param lessonId
     * @returns
     */
    public static async getLessonById(lessonId: string) {
        try {
            const lesson = await LessonRepository.findOne({ where: { id: lessonId } });
            return {
                code: 200,
                message: 'Get lesson success',
                data: lesson,
            };
        } catch (error) {
            console.log('Error getting lesson', error);
            throw error;
        }
    }

    /**
     * Get max order in topic
     * @param topicId
     * @returns
     */
    public static async getMaxOrderInTopic(topicId: string) {
        try {
            const maxOrder = await LessonRepository.maximum('orderInTopic', {
                topic: { id: topicId },
            });
            return {
                code: 200,
                message: 'Get max order in topic success',
                data: maxOrder,
            };
        } catch (error) {
            console.log('Error getting max order in topic', error);
            throw error;
        }
    }

    /**
     * Save lesson
     * @param lesson
     * @returns
     */
    public static async saveLesson(lesson: Partial<Lesson>) {
        try {
            const newLesson = await LessonRepository.save(lesson);
            return {
                code: 201,
                message: 'Save lesson success',
                data: newLesson,
            };
        } catch (error) {
            console.log('Error saving lesson', error);
            throw error;
        }
    }
}
