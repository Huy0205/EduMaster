import axios from '~/util/axios.customize';

export class PracticeService {
    public static getAllPractices(page?: number, limit?: number) {
        return axios.get('/practice/list', { params: { page, limit } });
    }
}
