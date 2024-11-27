import { db } from '~/configs';
import { Question } from '~/app/models';
import { Status } from '../enums';
import { In, IsNull, Not } from 'typeorm';

const questionRepository = db.AppDataSource.getRepository(Question);

interface AdminQuestion {
    id: string;
    content: string;
    status: Status;
    lesson: {
        name: string;
        orderInTopic: number;
    };
    topic: {
        name: string;
        orderInCourse: number;
        course: {
            name: string;
            grade: number;
        };
    };
}

const columnSelectAdmin = {
    id: true,
    content: true,
    status: true,
    lesson: {
        name: true,
        orderInTopic: true,
    },
    topic: {
        name: true,
        orderInCourse: true,
        course: {
            name: true,
            grade: true,
        },
    },
};

export class QuestionService {
    private static convertData(data: AdminQuestion[]) {
        const result = data.map((item: AdminQuestion) => {
            const question = {
                id: item.id,
                content: item.content,
                topicName: item.topic.name,
                courseName: item.topic.course.name,
                grade: item.topic.course.grade,
                status: item.status,
            };
            if (item.lesson) {
                question['lessonName'] = item.lesson.name;
            }
            return question;
        });
        return result;
    }

    /**
     * Get all questions of practice/quiz including id, content, lesson name, topic name, course name, grade
     * ordered by course name, topic order, lesson order, question order
     * paginated by page and limit
     * only for admin
     * @param page
     * @param limit
     * @returns
     */
    public static async getAllQuestions(isQuizQuestion: boolean, page: number, limit: number) {
        try {
            const [questions, total] = await questionRepository.findAndCount({
                relations: ['lesson', 'topic', 'topic.course'],
                select: columnSelectAdmin,
                where: {
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
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
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get all questions success',
                data: {
                    totalPages: Math.ceil(total / limit),
                    list: this.convertData(questions),
                },
            };
        } catch (error) {
            console.log('Error getting all questions', error);
            throw error;
        }
    }

    /**
     * Get questions by grade including id, content, lesson name, topic name, course name, grade
     * ordered by course name, topic order, lesson order, question order
     * paginated by page and limit
     * only for admin
     * @param grade
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByGrade(
        isQuizQuestion: boolean,
        grade: number,
        page: number,
        limit: number,
    ) {
        try {
            const [questions, total] = await questionRepository.findAndCount({
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
                where: {
                    topic: { course: { grade } },
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
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
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get questions by grade success',
                data: {
                    totalPages: Math.ceil(total / limit),
                    list: this.convertData(questions),
                },
            };
        } catch (error) {
            console.log('Error getting questions by grade', error);
            throw error;
        }
    }

    /**
     * Get questions by course including id, content, lesson name, topic name, course name, grade
     * ordered by topic order, lesson order, question order
     * paginated by page and limit
     * only for admin
     * @param courseId
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByCourse(
        isQuizQuestion: boolean,
        courseId: string,
        page: number,
        limit: number,
    ) {
        try {
            const [questions, total] = await questionRepository.findAndCount({
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
                where: {
                    topic: {
                        course: { id: courseId },
                    },
                    lesson: isQuizQuestion ? IsNull() : Not(IsNull()),
                },
                order: {
                    topic: {
                        orderInCourse: 'ASC',
                    },
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get questions by course success',
                data: {
                    totalPages: Math.ceil(total / limit),
                    list: this.convertData(questions),
                },
            };
        } catch (error) {
            console.log('Error getting questions by course', error);
            throw error;
        }
    }

    /**
     * Get questions by topic including id, content, lesson name, topic name, course name, grade
     * ordered by lesson order, question order
     * paginated by page and limit
     * only for admin
     * @param topicId
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByTopic(topicId: string, page: number, limit: number) {
        try {
            const [questions, total] = await questionRepository.findAndCount({
                relations: ['lesson', 'lesson.topic', 'lesson.topic.course'],
                select: columnSelectAdmin,
                where: {
                    lesson: {
                        topic: { id: topicId },
                    },
                },
                order: {
                    lesson: {
                        orderInTopic: 'ASC',
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                code: 200,
                message: 'Get questions by topic success',
                data: {
                    totalPages: Math.ceil(total / limit),
                    list: this.convertData(questions),
                },
            };
        } catch (error) {
            console.log('Error getting questions by topic', error);
            throw error;
        }
    }

    /**
     * Get questions by lesson including id, content, lesson name, topic name, course name, grade
     * Paginated by page and limit
     * Only for admin
     * @param lessonId
     * @param page
     * @param limit
     * @returns
     */
    public static async getQuestionsByLesson(lessonId: string, page: number, limit: number) {
        try {
            const [questions, total] = await questionRepository.findAndCount({
                relations: ['lesson', 'topic', 'topic.course'],
                select: columnSelectAdmin,
                where: {
                    lesson: { id: lessonId },
                },
                take: limit,
                skip: (page - 1) * limit,
            });

            return {
                code: 200,
                message: 'Get questions by review success',
                data: {
                    totalPages: Math.ceil(total / limit),
                    list: this.convertData(questions),
                },
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
                    status: Status.ACTIVE,
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
                    status: Status.ACTIVE,
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

    /**
     * Count questions by review
     */
    static async countQuestionsByLesson(lessonId: string) {
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
     * Add new question
     * @param question
     * @returns
     */
    public static async addQuestion(question: Partial<Question>) {
        try {
            const newQuestion = await questionRepository.save(question);
            return {
                code: 200,
                message: 'Add question success',
                data: newQuestion,
            };
        } catch (error) {
            console.log('Error adding question', error);
            throw error;
        }
    }

    public static async updateQuestion(questionId: string, question: Partial<Question>) {
        try {
            await questionRepository.update(questionId, question);
            return {
                code: 200,
                message: 'Update question success',
            };
        } catch (error) {
            console.log('Error updating question', error);
            throw error;
        }
    }
}
