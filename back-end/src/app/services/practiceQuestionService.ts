import { db } from '../../configs';
import { PracticeQuestion } from '../../app/models';

const PracticeQuestionRepository = db.AppDataSource.getRepository(PracticeQuestion);

export class PracticeQuestionService {
    public static async savePracticeQuestions(practiceQuestions: PracticeQuestion[]) {
        try {
            const result = await PracticeQuestionRepository.save(practiceQuestions);
            return {
                code: 200,
                message: 'Save practice questions successfully',
                data: result,
            };
        } catch (error) {
            console.error('Error saving practice questions', error);
            throw error;
        }
    }
}
