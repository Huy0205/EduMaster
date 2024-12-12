import { db } from '../../configs';
import { PracticeProgress } from '../../app/models';

const PracticeProgressRepository = db.AppDataSource.getRepository(PracticeProgress);

export class PracticeProgressService {
    public static async getPracticeProgressByUserAndPractice(userId: string, practiceId: string) {
        try {
            const practiceProgress = await PracticeProgressRepository.findOne({
                where: {
                    userId,
                    practiceId,
                },
            });
            return {
                code: 200,
                message: 'Get practice progress successfully',
                data: practiceProgress,
            };
        } catch (error) {
            console.error('Error getting practice progress', error);
            throw error;
        }
    }

    public static async addPracticeProgress(practiceProgress: Partial<PracticeProgress>) {
        try {
            const newPracticeProgress = await PracticeProgressRepository.save(practiceProgress);
            return {
                code: 201,
                message: 'Add practice progress success',
                data: newPracticeProgress,
            };
        } catch (error) {
            console.log('Error adding practice progress', error);
            throw error;
        }
    }
}
