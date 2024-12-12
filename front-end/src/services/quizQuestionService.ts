import axios from '~/util/axios.customize';

export class QuizQuestionService {
    public static addQuizQuestions(
        quizQuestions: { quizId: string; questionId: string; orderInQuiz: number }[],
    ) {
        return axios.post('quiz-question/add-multiple', { quizQuestions });
    }
}
