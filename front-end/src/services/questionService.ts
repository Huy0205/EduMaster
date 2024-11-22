import axios from '~/util/axios.customize';

export class QuestionService {
    public static async getAllQuestions(page?: number, limit?: number) {
        return axios.get('question/list', { params: { page, limit } });
    }

    public static async getQuestionsByGrade(grade: number, page?: number, limit?: number) {
        return axios.get('question/grade', { params: { grade, page, limit } });
    }

    public static async getQuestionsByCourse(courseId: string, page?: number, limit?: number) {
        return axios.get('question/course', { params: { courseId, page, limit } });
    }

    public static async getQuestionsByTopic(topicId: string, page?: number, limit?: number) {
        return axios.get('question/topic', { params: { topicId, page, limit } });
    }
}
