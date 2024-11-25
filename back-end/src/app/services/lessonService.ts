import { db } from '~/configs';
import { Lesson } from '~/app/models';
import { Role, Status } from '../enums';
import { FindOptionsOrderValue, In } from 'typeorm';

const LessonRepository = db.AppDataSource.getRepository(Lesson);

interface AdminLesson {
    id: string;
    name: string;
    orderInTopic: number;
    status: Status;
    topic: {
        name: string;
        orderInCourse: number;
        course: {
            name: string;
            grade: number;
        };
    };
}

const columnSelectStudent = {
    id: true,
    name: true,
    orderInTopic: true,
};

const columnSelectAdmin = {
    ...columnSelectStudent,
    topic: {
        name: true,
        orderInCourse: true,
        status: true,
        course: {
            name: true,
            grade: true,
        },
    },
};

export class LessonService {
    private static convertData(data: AdminLesson[]) {
        const result = data.map((item: AdminLesson) => {
            const lesson = {
                id: item.id,
                name: item.name,
                topicName: item.topic.name,
                courseName: item.topic.course.name,
                grade: item.topic.course.grade,
                status: item.status,
            };
            return lesson;
        });
        return result;
    }

    /**
     * Get all lessons including id, name, topic name, course name, grade
     * ordered by grade, course name, topic order, lesson order
     * paginated by page and limit
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllLessons(page: number, limit: number) {
        try {
            const [lessons, total] = await LessonRepository.findAndCount({
                relations: ['topic', 'topic.course'],
                select: columnSelectAdmin,
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
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get lessons success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: this.convertData(lessons),
                },
            };
        } catch (error) {
            console.log('Error getting lessons', error);
            throw error;
        }
    }

    /**
     * Get lessons by topic id, ordered by lesson order in topic
     * paginated by page and limit
     * for both admin and user
     * @param topicId
     * @param role
     * @param page
     * @param limit
     * @returns
     */
    public static async getLessonsByTopic(
        topicId: string,
        role: Role,
        page: number,
        limit: number,
    ) {
        try {
            const baseQuery = {
                where: {
                    topic: {
                        id: topicId,
                    },
                },
                order: { orderInTopic: 'ASC' as FindOptionsOrderValue },
                skip: (page - 1) * limit,
                take: limit,
            };
            const [lessons, total] =
                role === Role.STUDENT
                    ? await LessonRepository.findAndCount({
                          ...baseQuery,
                          where: { ...baseQuery.where, status: Status.ACTIVE },
                          select: columnSelectStudent,
                      })
                    : await LessonRepository.findAndCount({
                          ...baseQuery,
                          relations: ['topic', 'topic.course'],
                          select: columnSelectAdmin,
                      });

            const result = role === Role.STUDENT ? lessons : this.convertData(lessons);
            return {
                code: 200,
                message: 'Get lessons by topic success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: result,
                },
            };
        } catch (error) {
            console.log('Error getting lessons by topic', error);
            throw error;
        }
    }

    /**
     * Get lessons by course id, ordered by topic order in course, lesson order in topic
     * paginated by page and limit
     * only for admin
     * @param courseId
     * @param page
     * @param limit
     * @returns
     */
    public static async getLessonsByCourse(courseId: string, page: number, limit: number) {
        try {
            const [lessons, total] = await LessonRepository.findAndCount({
                relations: ['topic', 'topic.course'],
                where: {
                    topic: {
                        course: {
                            id: courseId,
                        },
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                select: columnSelectAdmin,
                order: {
                    topic: {
                        orderInCourse: 'ASC',
                    },
                    orderInTopic: 'ASC',
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get lessons by course success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: this.convertData(lessons),
                },
            };
        } catch (error) {
            console.log('Error getting lessons by course', error);
            throw error;
        }
    }

    public static async getLessonsByGrade(grade: number, page: number, limit: number) {
        try {
            const [lessons, total] = await LessonRepository.findAndCount({
                relations: ['topic', 'topic.course'],
                where: {
                    topic: { course: { grade } },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                select: columnSelectAdmin,
                order: {
                    topic: {
                        orderInCourse: 'ASC',
                    },
                    orderInTopic: 'ASC',
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get lessons by grade success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: this.convertData(lessons),
                },
            };
        } catch (error) {
            console.log('Error getting lessons by grade', error);
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
     * Add new lesson
     * @param lesson
     * @returns
     */
    public static async addLesson(lesson: Partial<Lesson>) {
        try {
            const newLesson = await LessonRepository.save(lesson);
            return {
                code: 201,
                message: 'Add lesson success',
                data: newLesson,
            };
        } catch (error) {
            console.log('Error adding lesson', error);
            throw error;
        }
    }

    /**
     * Update lesson status
     * @param lessonId
     * @param status
     * @returns
     */
    public static async updateStatus(lessonId: string, status: Status) {
        try {
            await LessonRepository.update({ id: lessonId }, { status });
            return {
                code: 200,
                message: 'Update lesson status success',
            };
        } catch (error) {
            console.log('Error updating lesson status', error);
            throw error;
        }
    }
}
