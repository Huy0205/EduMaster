import { db } from '~/configs';
import { Question } from '~/app/models';
import { Status } from '../enums';
import { In, IsNull, Not } from 'typeorm';

const questionRepository = db.AppDataSource.getRepository(Question);

export class QuestionService {
    /**
     * Get all questions of practice/quiz
     * ordered by course name, topic order, lesson order, question order
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllQuestions(isQuizQuestion: boolean) {
        try {
            const questions = await questionRepository.find({
                where: {
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
                    status: In([Status.ACTIVE]),
                },
                order: {
                    topic: {
                        course: {
                            grade: 'ASC',
                            name: 'ASC',
                        },
                        orderInCourse: 'ASC',
                    },
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
            });

            return {
                code: 200,
                message: 'Get all questions success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting all questions', error);
            throw error;
        }
    }

    /**
     * Get questions by grade
     * ordered by course name, topic order, lesson order, question order
     * only for admin
     * @param grade
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByGrade(isQuizQuestion: boolean, grade: number) {
        try {
            const questions = await questionRepository.find({
                where: {
                    topic: { course: { grade } },
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
                    status: In([Status.ACTIVE]),
                },
                order: {
                    topic: {
                        course: {
                            name: 'ASC',
                        },
                        orderInCourse: 'ASC',
                    },
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
            });

            return {
                code: 200,
                message: 'Get questions by grade success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting questions by grade', error);
            throw error;
        }
    }

    /**
     * Get questions by course
     * ordered by topic order, lesson order, question order
     * only for admin
     * @param courseId
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByCourse(isQuizQuestion: boolean, courseId: string) {
        try {
            const questions = await questionRepository.find({
                where: {
                    topic: {
                        course: { id: courseId },
                    },
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
                    status: In([Status.ACTIVE]),
                },
                order: {
                    topic: {
                        orderInCourse: 'ASC',
                    },
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
            });

            return {
                code: 200,
                message: 'Get questions by course success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting questions by course', error);
            throw error;
        }
    }

    /**
     * Get questions by topic
     * ordered by lesson order, question order
     * only for admin
     * @param topicId
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByTopic(isQuizQuestion: boolean, topicId: string) {
        try {
            const questions = await questionRepository.find({
                where: {
                    topic: { id: topicId },
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
                    status: In([Status.ACTIVE]),
                },
                order: {
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
            });

            return {
                code: 200,
                message: 'Get questions by topic success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting questions by topic', error);
            throw error;
        }
    }

    /**
     * Get questions by lesson
     * Only for admin
     * @param lessonId
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByLesson(lessonId: string) {
        try {
            const questions = await questionRepository.find({
                where: {
                    lesson: { id: lessonId },
                    status: In([Status.ACTIVE]),
                },
            });

            return {
                code: 200,
                message: 'Get questions by review success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting questions by review', error);
            throw error;
        }
    }

    public static async getQuestionByPractice(practiceId: string) {
        try {
            const questions = await questionRepository.find({
                relations: ['practiceQuestions', 'answers'],
                select: {
                    id: true,
                    content: true,
                    image: true,
                    type: true,
                    feedback: true,
                    answers: {
                        id: true,
                        content: true,
                        isCorrect: true,
                    },
                },
                where: {
                    practiceQuestions: {
                        practiceId,
                    },
                },
                order: {
                    practiceQuestions: {
                        orderInPractice: 'ASC',
                    },
                },
            });

            return {
                code: 200,
                message: 'Get questions by practice success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting questions by practice', error);
            throw error;
        }
    }

    /**
     * Get questions by quiz, order by orderInQuiz ascending
     * Include id, content, image, type, feedback, answers
     * @param quizId
     * @returns
     */
    public static async getQuestionsByQuiz(quizId: string) {
        try {
            const questions = await questionRepository.find({
                relations: ['quizQuestions', 'answers'],
                select: {
                    id: true,
                    content: true,
                    image: true,
                    type: true,
                    feedback: true,
                    answers: {
                        id: true,
                        content: true,
                        isCorrect: true,
                    },
                },
                where: {
                    quizQuestions: {
                        quizId,
                    },
                },
                order: {
                    quizQuestions: {
                        orderInQuiz: 'ASC',
                    },
                },
            });

            return {
                code: 200,
                message: 'Get questions by quiz success',
                data: questions,
            };
        } catch (error) {
            console.log('Error getting questions by quiz', error);
            throw error;
        }
    }

    public static async getQuestionById(questionId: string) {
        try {
            const question = await questionRepository.findOne({
                relations: ['answers'],
                select: {
                    id: true,
                    content: true,
                    image: true,
                    type: true,
                    feedback: true,
                    answers: {
                        id: true,
                        content: true,
                        isCorrect: true,
                    },
                },
                where: {
                    id: questionId,
                },
            });

            return {
                code: 200,
                message: 'Get question by id success',
                data: question,
            };
        } catch (error) {
            console.log('Error getting question by id', error);
            throw error;
        }
    }

    /**
     * Count questions by review
     */
    public static async countQuestionsByLesson(lessonId: string) {
        try {
            const count = await questionRepository.count({
                where: {
                    lesson: { id: lessonId },
                },
            });
            return {
                code: 200,
                message: 'Count questions by review success',
                data: count,
            };
        } catch (error) {
            console.log('Error counting questions by review', error);
            throw error;
        }
    }

    /**
     * Save question
     * @param question
     * @returns
     */
    public static async saveQuestion(question: Partial<Question>) {
        try {
            const savedQuestion = await questionRepository.save(question);
            return {
                code: 200,
                message: 'Save question success',
                data: savedQuestion,
            };
        } catch (error) {
            console.log('Error saving question', error);
            throw error;
        }
    }
}
