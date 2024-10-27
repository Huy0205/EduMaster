import { db } from '~/configs';
import { Quiz } from '~/app/models';

const { AppDataSource } = db;
const quizRepository = AppDataSource.getRepository(Quiz);

export class QuizService {
    /**
     * Add a new quiz
     * @param quiz
     * @returns
     */
    static async addQuiz(quiz: Partial<Quiz>) {
        try {
            const newQuiz = await quizRepository.save(quiz);
            return {
                code: 200,
                message: 'Add quiz success',
                data: newQuiz,
            };
        } catch (error) {
            console.log('Error adding quiz', error);
            throw error;
        }
    }
}
