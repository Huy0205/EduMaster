import axios from '~/util/axios.customize';

export class TheoryService {
    public static getAllTheories(page?: number, limit?: number) {
        return axios.get('theory/list', { params: { page, limit } });
    }

    public static getTheoriesByGrade(grade: number, page?: number, limit?: number) {
        return axios.get(`theory/grade/${grade}`, { params: { page, limit } });
    }

    public static getTheoriesByCourse(courseId: string, page?: number, limit?: number) {
        return axios.get(`theory/course/${courseId}`, { params: { page, limit } });
    }

    public static getTheoriesByTopic(topicId: string, page?: number, limit?: number) {
        return axios.get(`theory/topic/${topicId}`, { params: { page, limit } });
    }
}
