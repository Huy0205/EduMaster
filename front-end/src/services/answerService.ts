import axios from '~/util/axios.customize';

export class AnswerService {
    public static addAnswers(data: { content: string; isCorrect: boolean; questionId: string }[]) {
        return axios.post('answer/add-multiple', data);
    }
}
