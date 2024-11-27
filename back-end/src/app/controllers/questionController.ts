import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { LessonService, QuestionService, TopicService } from '~/app/services';
import { ResponseUtil } from '~/utils';
import { QuestionType } from '../enums';

export class QuestionController {
    public static async getAllQuestions(req: Request, res: Response, next: NextFunction) {
        const { isQuizQuestion, page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const response = await QuestionService.getAllQuestions(
                isQuizQuestion === 'true',
                pageNum,
                limitNum,
            );
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
            const { isQuizQuestion, page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;
            try {
                const response = await QuestionService.getQuestionsByGrade(
                    isQuizQuestion === 'true',
                    Number(grade),
                    pageNum,
                    limitNum,
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
            const { isQuizQuestion, page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await QuestionService.getQuestionsByCourse(
                    isQuizQuestion === 'true',
                    courseId,
                    pageNum,
                    limitNum,
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
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await QuestionService.getQuestionsByTopic(
                    topicId,
                    pageNum,
                    limitNum,
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
                const { page, limit } = req.query;
                const pageNum = Number(page) > 0 ? Number(page) : 1;
                const limitNum = Number(limit) > 0 ? Number(limit) : 10;
                const response = await QuestionService.getQuestionsByLesson(
                    lessonId,
                    pageNum,
                    limitNum,
                );
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

    public static async addQuestion(req: Request, res: Response, next: NextFunction) {
        const { content, image, type, feedback, lessonId, topicId } = req.body;
        console.log(content, image, type, feedback, lessonId, topicId);
        if ((!content && !image) || !type || !topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId) || !(type in QuestionType) || (lessonId && !isUUID(lessonId))) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const topicRes = await TopicService.getTopicById(topicId);
                let lessonData = null;
                if (lessonId) {
                    const lessonRes = await LessonService.getLessonById(lessonId);
                    lessonData = lessonRes.data;
                }
                const response = await QuestionService.addQuestion({
                    content,
                    image,
                    type,
                    feedback,
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
        const { content, image, type, feedback, lessonId } = req.body;

        if (!questionId) {
            ResponseUtil.sendMissingData(res);
        } else if (
            !isUUID(questionId) ||
            (type && !(type in QuestionType)) ||
            (lessonId && !isUUID(lessonId))
        ) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                let lessonData = null;
                if (lessonId) {
                    const lessonRes = await LessonService.getLessonById(lessonId);
                    lessonData = lessonRes.data;
                }
                const response = await QuestionService.updateQuestion(questionId, {
                    content,
                    image,
                    type,
                    feedback,
                    lesson: lessonData,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error updating question', error);
                next(error);
            }
        }
    }
}
