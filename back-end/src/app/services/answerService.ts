import { db } from '~/configs';
import { Answer } from '~/app/models';

const AnswerRepository = db.AppDataSource.getRepository(Answer);

export class AnswerService {
    /**
     * Get answer by Question
     * @param questionId
     * @returns
     */
    static async getAnswersByQuestion(questionId: string) {
        try {
            const response = await AnswerRepository.find({
                where: {
                    question: {
                        id: questionId,
                    },
                },
            });
            return {
                code: 200,
                message: 'Get answers by question success',
                data: response,
            };
        } catch (error) {
            console.log('Error getting answers by question', error);
            throw error;
        }
    }

    /**
     * Add multiple answers
     * @param answers
     * @returns
     */
    public static async addAnswers(answers: Answer[]) {
        try {
            const response = await AnswerRepository.save(answers);
            return {
                code: 200,
                message: 'Add answer success',
                data: response,
            };
        } catch (error) {
            console.log('Error adding answer', error);
            throw error;
        }
    }
}
