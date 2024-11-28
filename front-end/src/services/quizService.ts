import axios from '~/util/axios.customize';

export class QuizService {
    public static getAllQuizzes(page?: number, limit?: number) {
        return axios.get('/quiz/list', { params: { page, limit } });
    }

    public static getQuizByGrade(grade: number, page?: number, limit?: number) {
        return axios.get(`/quiz/grade/${grade}`, { params: { page, limit } });
    }
}
