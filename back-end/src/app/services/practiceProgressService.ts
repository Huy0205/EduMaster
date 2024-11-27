import { db } from '~/configs';
import { PracticeProgress } from '~/app/models';

const PracticeProgressRepository = db.AppDataSource.getRepository(PracticeProgress);

export class PracticeProgressService {
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
