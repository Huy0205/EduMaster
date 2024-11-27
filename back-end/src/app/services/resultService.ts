import { db } from '~/configs';
import { Result } from '~/app/models';

const ResultRepository = db.AppDataSource.getRepository(Result);

export class ResultService {
    /**
     * Get results by user, ordered by createdAt
     * @param userId
     * @returns
     */
    public static async getResultsByUser(userId: string) {
        try {
            const results = await ResultRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
            });
            return {
                code: 200,
                message: 'Get results success',
                data: results,
            };
        } catch (error) {
            console.log('Error getting results', error);
            throw error;
        }
    }

    /**
     * Get result by user and quiz max score
     * @param userId
     * @param quizId
     * @returns
     */
    public static async getResultByUserAndQuizMaxScore(userId: string, quizId: string) {
        try {
            const result = await ResultRepository.findOne({
                where: { userId, quizId },
                order: { score: 'DESC' },
            });
            return {
                code: 200,
                message: 'Get result success',
                data: result,
            };
        } catch (error) {
            console.log('Error getting result', error);
            throw error;
        }
    }

    /**
     * Get result by user and quiz latest
     * @param userId
     * @param quizId
     * @returns
     */
    public static async getResultByUserAndQuizLatest(userId: string, quizId: string) {
        try {
            const result = await ResultRepository.findOne({
                where: { userId, quizId },
                order: { createdAt: 'DESC' },
            });
            return {
                code: 200,
                message: 'Get result success',
                data: result,
            };
        } catch (error) {
            console.log('Error getting result', error);
            throw error;
        }
    }

    /**
     * Add result
     * @param data
     * @returns
     */
    public static async addResult(data: Partial<Result>) {
        try {
            const result = await ResultRepository.save(data);
            return {
                code: 200,
                message: 'Add result success',
                data: result,
            };
        } catch (error) {
            console.log('Error adding result', error);
            throw error;
        }
    }

    /**
     * Update result
     * @param id
     * @param data
     * @returns
     */
    public static async updateResult(id: string, data: Partial<Result>) {
        try {
            await ResultRepository.update(id, data);
            return {
                code: 200,
                message: 'Update result success',
            };
        } catch (error) {
            console.log('Error updating result', error);
            throw error;
        }
    }
}
