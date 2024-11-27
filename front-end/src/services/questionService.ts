import axios from '~/util/axios.customize';

export class QuestionService {
    public static getAllQuestions(isQuizQuestion: boolean, page?: number, limit?: number) {
        return axios.get('question/list', { params: { isQuizQuestion, page, limit } });
    }

    public static getQuestionsByGrade(
        isQuizQuestion: boolean,
        grade: number,
        page?: number,
        limit?: number,
    ) {
        return axios.get(`question/grade/${grade}`, { params: { isQuizQuestion, page, limit } });
    }

    public static getQuestionsByCourse(
        isQuizQuestion: boolean,
        courseId: string,
        page?: number,
        limit?: number,
    ) {
        return axios.get(`question/course/${courseId}`, {
            params: { isQuizQuestion, page, limit },
        });
    }

    public static getQuestionsByTopic(
        isQuizQuestion: boolean,
        topicId: string,
        page?: number,
        limit?: number,
    ) {
        return axios.get(`question/topic/${topicId}`, { params: { isQuizQuestion, page, limit } });
    }

    public static getQuestionsByLesson(lessonId: string, page?: number, limit?: number) {
        return axios.get(`question/lesson/${lessonId}`, { params: { page, limit } });
    }

    public static addQuestion(data: {
        content: string;
        image: string;
        type: string;
        feedback: string;
        topicId: string;
        lessonId?: string;
    }) {
        return axios.post('question/add', data);
    }

    public static updateQuestion(
        id: string,
        data: {
            content?: string;
            image?: string;
            type?: 1 | 2 | 3;
            feedback?: string;
            lessonId?: string;
        },
    ) {
        return axios.put(`question/update/${id}`, data);
    }

    public static updateStatus(id: string, status: -1 | 0 | 1) {
        return axios.put(`question/update/${id}`, { status });
    }
}
