import axios from '~/util/axios.customize';

export class AnswerService {
    public static addAnswers(
        answers: {
            content: string;
            isCorrect: boolean;
            question: {
                id: string;
            };
        }[],
    ) {
        return axios.post('answer/add-multiple', { answers });
    }
}
