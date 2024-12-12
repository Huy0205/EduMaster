import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { LessonService, QuestionService, TopicService } from '~/app/services';
import { ResponseUtil } from '~/utils';
import { QuestionType, Status } from '../enums';

export class QuestionController {
    public static async getAllQuestions(req: Request, res: Response, next: NextFunction) {
        const { isQuizQuestion } = req.query;
        try {
            const response = await QuestionService.getAllQuestions(isQuizQuestion === 'true');
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            console.log('Error getting all questions', error);
            next(error);
        }
    }

    public static async getQuestionsByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { isQuizQuestion } = req.query;
            try {
                const response = await QuestionService.getQuestionsByGrade(
                    isQuizQuestion === 'true',
                    Number(grade),
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by grade', error);
                next(error);
            }
        }
    }

    public static async getQuestionsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { isQuizQuestion } = req.query;
            try {
                const response = await QuestionService.getQuestionsByCourse(
                    isQuizQuestion === 'true',
                    courseId,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by course', error);
                next(error);
            }
        }
    }

    public static async getQuestionsByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { isQuizQuestion } = req.query;
            try {
                const response = await QuestionService.getQuestionsByTopic(
                    isQuizQuestion === 'true',
                    topicId,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by topic', error);
                next(error);
            }
        }
    }

    public static async getQuestionsByLesson(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;

        if (!lessonId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuestionService.getQuestionsByLesson(lessonId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by lesson', error);
                next(error);
            }
        }
    }

    public static async getQuestionByPractice(req: Request, res: Response, next: NextFunction) {
        const { practiceId } = req.params;

        if (!practiceId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(practiceId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuestionService.getQuestionByPractice(practiceId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting question by practice', error);
                next(error);
            }
        }
    }

    public static async getQuestionsByQuiz(req: Request, res: Response, next: NextFunction) {
        const { quizId } = req.params;

        if (!quizId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(quizId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuestionService.getQuestionsByQuiz(quizId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by quiz', error);
                next(error);
            }
        }
    }

    public static async getQuestionById(req: Request, res: Response, next: NextFunction) {
        const { questionId } = req.params;
        if (!questionId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(questionId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuestionService.getQuestionById(questionId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting question by id', error);
                next(error);
            }
        }
    }

    public static async addQuestion(req: Request, res: Response, next: NextFunction) {
        const { content, image, type, feedback, status, lessonId, topicId } = req.body;
        console.log(status in Status);
        if ((!content && !image) || !type || !topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (
            !isUUID(topicId) ||
            !(type in QuestionType) ||
            (status !== undefined && !(status in Status)) ||
            (lessonId && !isUUID(lessonId))
        ) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const topicRes = await TopicService.getTopicById(topicId);
                let lessonData = null;
                if (lessonId) {
                    const lessonRes = await LessonService.getLessonById(lessonId);
                    lessonData = lessonRes.data;
                }
                const response = await QuestionService.saveQuestion({
                    content,
                    image,
                    type,
                    feedback,
                    status,
                    lesson: lessonData,
                    topic: topicRes.data,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error adding question', error);
                next(error);
            }
        }
    }

    public static async updateQuestion(req: Request, res: Response, next: NextFunction) {
        const { questionId } = req.params;
        const { content, image, feedback, status } = req.body;

        if (!questionId || (!content && !image && !feedback && status === undefined)) {
            ResponseUtil.sendMissingData(res);
        } else if (
            !isUUID(questionId) ||
            (status !== undefined && !(status in Status))
        ) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuestionService.saveQuestion({
                    id: questionId,
                    content,
                    image,
                    feedback,
                    status,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error updating question', error);
                next(error);
            }
        }
    }
}
