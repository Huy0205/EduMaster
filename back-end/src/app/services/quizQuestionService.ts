import { db } from '~/configs';
import { QuizQuestion } from '~/app/models';

const QuizQuestionRepository = db.AppDataSource.getRepository(QuizQuestion);

export class QuizQuestionService {
    /**
     * Add new quiz question
     * @param quizId
     * @param questionId
     * @returns
     */
    static async addQuizQuestion(quizId: string, questionId: string) {
        try {
            const quizQuestion = new QuizQuestion();
            quizQuestion.quizId = quizId;
            quizQuestion.questionId = questionId;
            const result = await QuizQuestionRepository.save(quizQuestion);
            return {
                code: 200,
                message: 'Quiz question added successfully',
                data: result,
            };
        } catch (error) {
            console.log('Error adding quiz question', error);
            throw error;
        }
    }
}
