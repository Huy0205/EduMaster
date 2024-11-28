import { db } from '~/configs';
import { Quiz } from '~/app/models';

const { AppDataSource } = db;
const quizRepository = AppDataSource.getRepository(Quiz);

export class QuizService {
    public static async getAllQuizzes(page: number, limit: number) {
        try {
            const [quizzes, total] = await quizRepository.findAndCount({
                relations: ['topic'],
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
            const result = quizzes.map((quiz) => {
                return {
                    id: quiz.id,
                    name: quiz.name,
                    time: quiz.time,
                    bonusPoint: quiz.bonusPoint,
                    topicName: quiz.topic.name,
                    courseName: quiz.topic.course.name,
                    grade: quiz.topic.course.grade,
                };
            });
            return {
                code: 200,
                message: 'Get all quizzes successfully',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: result,
                },
            };
        } catch (error) {
            console.error('Error getting all quizzes', error);
            throw error;
        }
    }

    public static async getQuizByGrade(grade: number, page: number, limit: number) {
        try {
            const [quizzes, total] = await quizRepository.findAndCount({
                relations: ['topic'],
                where: {
                    topic: {
                        course: {
                            grade,
                        },
                    },
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
            const result = quizzes.map((quiz) => {
                return {
                    id: quiz.id,
                    name: quiz.name,
                    time: quiz.time,
                    bonusPoint: quiz.bonusPoint,
                    topicName: quiz.topic.name,
                    courseName: quiz.topic.course.name,
                    grade: quiz.topic.course.grade,
                };
            });
            return {
                code: 200,
                message: 'Get quizzes by grade successfully',
                data: {
                    totalPage: Math.ceil(total / limit),
                    list: result,
                },
            };
        } catch (error) {
            console.error('Error getting quizzes by grade', error);
            throw error;
        }
    }

    /**
     * Add a new quiz
     * @param quiz
     * @returns
     */
    static async addQuiz(quiz: Partial<Quiz>) {
        try {
            const newQuiz = await quizRepository.save(quiz);
            return {
                code: 200,
                message: 'Add quiz success',
                data: newQuiz,
            };
        } catch (error) {
            console.log('Error adding quiz', error);
            throw error;
        }
    }

    /**
     * Get quiz by topic id
     * @param topicId
     * @returns
     */
    static async getQuizByTopicId(topicId: string) {
        try {
            const quizzes = await quizRepository.find({
                where: {
                    topic: {
                        id: topicId,
                    },
                },
            });
            return {
                code: 200,
                message: 'Get quizzes success',
                data: quizzes,
            };
        } catch (error) {
            console.log('Error getting quizzes', error);
            throw error;
        }
    }
}
