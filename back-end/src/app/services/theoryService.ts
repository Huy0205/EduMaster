import { db } from '~/configs';
import { Theory } from '~/app/models';

const TheoryRepository = db.AppDataSource.getRepository(Theory);

interface AdminTheory {
    id: string;
    title: string;
    url: string;
    description: string;
    orderInLesson: number;
    lesson: {
        name: string;
        orderInTopic: number;
        topic: {
            name: string;
            orderInCourse: number;
            course: {
                name: string;
                grade: number;
            };
        };
    };
}

const columnSelectAdmin = {
    id: true,
    title: true,
    url: true,
    description: true,
    orderInLesson: true,
    lesson: {
        name: true,
        orderInTopic: true,
        topic: {
            name: true,
            orderInCourse: true,
            course: {
                name: true,
                grade: true,
            },
        },
    },
};

export class TheoryService {
    private static convertData(data: AdminTheory[]) {
        const result = data.map((item: AdminTheory) => {
            const theory = {
                id: item.id,
                title: item.title,
                url: item.url,
                description: item.description,
                lessonName: item.lesson.name,
                topicName: item.lesson.topic.name,
                courseName: item.lesson.topic.course.name,
                grade: item.lesson.topic.course.grade,
            };
            return theory;
        });
        return result;
    }

    /**
     * Get all theories including id, title, url, description, lesson name, topic name, course name, grade
     * ordered by grade, course name, topic order, lesson order, theory order
     * paginated by page and limit
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllTheories(page: number, limit: number) {
        try {
            const [theories, total] = await TheoryRepository.findAndCount({
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
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

            return {
                code: 200,
                message: 'Get all theories success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: theories,
                },
            };
        } catch (error) {
            console.log('Error getting all theories', error);
            throw error;
        }
    }

    /**
     * Get theories by grade including id, title, url, description, lesson name, topic name, course name, grade
     * ordered by topic order, lesson order, theory order
     * paginated by page and limit
     * only for admin
     * @param grade
     * @param page
     * @param limit
     * @returns
     */
    public static async getTheoriesByGrade(grade: number, page: number, limit: number) {
        try {
            const [theories, total] = await TheoryRepository.findAndCount({
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
                where: {
                    lesson: {
                        topic: {
                            course: {
                                grade,
                            },
                        },
                    },
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
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get theories by grade success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: this.convertData(theories),
                },
            };
        } catch (error) {
            console.log('Error getting theories by grade', error);
            throw error;
        }
    }

    /**
     * Get theories by course including id, title, url, description, lesson name, topic name, course name, grade
     * ordered by topic order, lesson order, theory order
     * paginated by page and limit
     * only for admin
     * @param courseId
     * @param page
     * @param limit
     * @returns
     */
    public static async getTheoriesByCourse(courseId: string, page: number, limit: number) {
        try {
            const [theories, total] = await TheoryRepository.findAndCount({
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
                where: {
                    lesson: {
                        topic: {
                            course: {
                                id: courseId,
                            },
                        },
                    },
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
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get theories by course success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: this.convertData(theories),
                },
            };
        } catch (error) {
            console.log('Error getting theories by course', error);
            throw error;
        }
    }

    /**
     * Get theories by topic including id, title, url, description, lesson name, topic name, course name, grade
     * ordered by lesson order, theory order
     * paginated by page and limit
     * only for admin
     * @param topicId
     * @param page
     * @param limit
     * @returns
     */
    public static async getTheoriesByTopic(topicId: string, page: number, limit: number) {
        try {
            const [theories, total] = await TheoryRepository.findAndCount({
                where: {
                    lesson: {
                        topic: {
                            id: topicId,
                        },
                    },
                },
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
                order: {
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                    orderInLesson: 'ASC',
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get theories by topic success',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: this.convertData(theories),
                },
            };
        } catch (error) {
            console.log('Error getting theories by topic', error);
            throw error;
        }
    }

    /**
     * Get theories by review
     * @param reviewId
     * @returns
     */
    public static async getTheoriesByLesson(lessonId: string) {
        try {
            const response = await TheoryRepository.find({
                where: {
                    lesson: {
                        id: lessonId,
                    },
                },
            });
            return {
                code: 200,
                message: 'Get theories by course success',
                data: response,
            };
        } catch (error) {
            console.log('Error getting theories by course', error);
            throw error;
        }
    }
}
