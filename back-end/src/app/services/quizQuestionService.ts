import { db } from '~/configs';
import { QuizQuestion } from '~/app/models';

const QuizQuestionRepository = db.AppDataSource.getRepository(QuizQuestion);

export class QuizQuestionService {
    /**
     * Save quiz questions
     * @param quizQuestions
     * @returns
     */
    public static async saveQuizQuestions(quizQuestions: QuizQuestion[]) {
        try {
            const result = await QuizQuestionRepository.save(quizQuestions);
            return {
                code: 200,
                message: 'Save quiz questions successfully',
                data: result,
            };
        } catch (error) {
            console.error('Error saving quiz questions', error);
            throw error;
        }
    }
}
