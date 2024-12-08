import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { ResultService } from '../services';
import { ResponseUtil } from '~/utils';

export class ResultController {
    public static async getResultsByUser(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        if (!userId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const results = await ResultService.getResultsByUser(userId);
                ResponseUtil.sendResponse(res, results);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getResultByUserAndQuizMaxScore(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { userId, quizId } = req.params;
        if (!userId || !quizId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(quizId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await ResultService.getResultByUserAndQuizMaxScore(userId, quizId);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getResultsByUserAndQuiz(req: Request, res: Response, next: NextFunction) {
        const { userId, quizId } = req.params;
        if (!userId || !quizId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(quizId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const results = await ResultService.getResultsByUserAndQuiz(userId, quizId);
                ResponseUtil.sendResponse(res, results);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getResultByUserAndQuizLatest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { userId, quizId } = req.params;
        if (!userId || !quizId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(quizId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await ResultService.getResultByUserAndQuizLatest(userId, quizId);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async addResult(req: Request, res: Response, next: NextFunction) {
        const { score, correctCount, userId, quizId } = req.body;
        console.log('score', score);
        console.log('correctCount', correctCount);
        console.log('type score', typeof score);
        console.log('type correctCount', typeof correctCount);
        if (score === undefined || correctCount === undefined || !userId || !quizId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const result = await ResultService.addResult({
                    score: Number(score),
                    correctCount: Number(correctCount),
                    userId,
                    quizId,
                });
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateResult(req: Request, res: Response, next: NextFunction) {
        const { resultId } = req.params;
        const { score, correctCount } = req.body;
        if (!resultId || !score || !correctCount) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(resultId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await ResultService.updateResult(resultId, { score, correctCount });
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }
}
