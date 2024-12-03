import axios from '~/util/axios.customize';

export class QuizService {
    public static getAllQuizzes() {
        return axios.get('/quiz/list');
    }

    public static getQuizByGrade(grade: number) {
        return axios.get(`/quiz/grade/${grade}`);
    }

    public static getQuizByCourse(courseId: number) {
        return axios.get(`/quiz/course/${courseId}`);
    }

    public static getQuizByTopic(topicId: number, role?: 0 | 1) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`/quiz/topic/${topicId}`, {
            headers,
        });
    }
}
