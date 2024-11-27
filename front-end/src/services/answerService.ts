import axios from '~/util/axios.customize';

export class AnswerService {
    public static addAnswers(
        answers: { content: string; isCorrect: boolean; questionId: string }[],
    ) {
        return axios.post('answer/add-multiple', { answers });
    }
}
