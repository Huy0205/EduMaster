import { db } from '~/configs';
import { Quiz } from '~/app/models';
import { In } from 'typeorm';
import { Role, Status } from '../enums';

const { AppDataSource } = db;
const quizRepository = AppDataSource.getRepository(Quiz);

export class QuizService {
    public static async getAllQuizzes() {
        try {
            const quizzes = await quizRepository.find({
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
                message: 'Get all quizzes successfully',
                data: quizzes,
            };
        } catch (error) {
            console.error('Error getting all quizzes', error);
            throw error;
        }
    }

    public static async getQuizByGrade(grade: number) {
        try {
            const quizzes = await quizRepository.find({
                where: {
                    topic: {
                        course: {
                            grade,
                        },
                    },
                    status: In([Status.ACTIVE, Status.INACTIVE]),
                },
                order: {
                    topic: {
                        course: {
                            name: 'ASC',
                        },
                        orderInCourse: 'ASC',
                    },
                    orderInTopic: 'ASC',
                },
            });
            return {
                code: 200,
                message: 'Get quizzes by grade successfully',
                data: quizzes,
            };
        } catch (error) {
            console.error('Error getting quizzes by grade', error);
            throw error;
        }
    }

    public static async getQuizByCourse(courseId: string) {
        try {
            const quizzes = await quizRepository.find({
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
                message: 'Get quizzes by course successfully',
                data: quizzes,
            };
        } catch (error) {
            console.error('Error getting quizzes by course', error);
            throw error;
        }
    }

    public static async getQuizByTopic(topicId: string, role: Role) {
        try {
            const quizzes = await quizRepository.find({
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
                message: 'Get quizzes by topic successfully',
                data: quizzes,
            };
        } catch (error) {
            console.error('Error getting quizzes by topic', error);
            throw error;
        }
    }

    public static async getQuizById(quizId: string) {
        try {
            const quiz = await quizRepository.findOne({
                where: {
                    id: quizId,
                },
            });
            return {
                code: 200,
                message: 'Get quiz by id successfully',
                data: quiz,
            };
        } catch (error) {
            console.error('Error getting quiz by id', error);
            throw error;
        }
    }

    /**
     * Save quiz
     * @param quiz
     * @returns
     */
    public static async saveQuiz(quiz: Partial<Quiz>) {
        try {
            const newQuiz = await quizRepository.save(quiz);
            return {
                code: 200,
                message: 'Save quiz successfully',
                data: newQuiz,
            };
        } catch (error) {
            console.log('Error saving quiz', error);
            throw error;
        }
    }
}
