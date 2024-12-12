import axios from '~/util/axios.customize';

export class PracticeQuestionService {
    public static addPracticeQuestion(
        practiceQuestions: { practiceId: string; questionId: string; orderInPractice: number }[],
    ) {
        return axios.post('practice-question/add-multiple', { practiceQuestions });
    }
}
