import { db } from '~/configs';
import { Practice } from '~/app/models';

const PracticeRepository = db.AppDataSource.getRepository(Practice);

export class PracticeService {
    public static async getAllPractices(page: number, limit: number) {
        try {
            const [practices, total] = await PracticeRepository.findAndCount({
                relations: ['lesson'],
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
                skip: (page - 1) * limit,
                take: limit,
            });
            const result = practices.map((practice) => {
                return {
                    id: practice.id,
                    name: practice.name,
                    bonusPoint: practice.bonusPoint,
                    lessonName: practice.lesson.name,
                    topicName: practice.lesson.topic.name,
                    courseName: practice.lesson.topic.course.name,
                    grade: practice.lesson.topic.course.grade,
                };
            });
            return {
                code: 200,
                message: 'Get all practices successfully',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: result,
                },
            };
        } catch (error) {
            console.error('Error getting all practices', error);
            throw error;
        }
    }

    /**
     * Get practices by lesson id
     * @param lessonId
     * @returns
     */
    public static async getPracticesByLesson(lessonId: string) {
        try {
            const practices = await PracticeRepository.find({
                where: {
                    lesson: {
                        id: lessonId,
                    },
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
}
