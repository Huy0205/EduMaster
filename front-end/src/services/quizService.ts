import axios from '~/util/axios.customize';

export class QuizService {
    public static getAllQuizzes() {
        return axios.get('/quiz/list');
    }

    public static countAllQuizzes() {
        return axios.get('/quiz/count');
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

    public static addQuiz(quiz: {
        name: string;
        time: number;
        bonusPoint?: number;
        topicId: string;
    }) {
        return axios.post('/quiz/add', quiz);
    }

    public static updateQuiz(
        quizId: string,
        data: {
            name?: string;
            time?: number;
            bonusPoint?: number;
            status?: -1 | 0 | 1;
        },
    ) {
        return axios.put(`quiz/update/${quizId}`, data);
    }
}
