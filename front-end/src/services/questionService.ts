import axios from '~/util/axios.customize';

export class QuestionService {
    public static getAllQuestions(page?: number, limit?: number) {
        return axios.get('question/list', { params: { page, limit } });
    }

    public static getQuestionsByGrade(grade: number, page?: number, limit?: number) {
        return axios.get('question/grade', { params: { grade, page, limit } });
    }

    public static getQuestionsByCourse(courseId: string, page?: number, limit?: number) {
        return axios.get('question/course', { params: { courseId, page, limit } });
    }

    public static getQuestionsByTopic(topicId: string, page?: number, limit?: number) {
        return axios.get('question/topic', { params: { topicId, page, limit } });
    }

    public static addQuestion(data: {
        content: string;
        image: string;
        type: string;
        feedback: string;
        topicId: string;
        lessonId?: string;
    }) {
        return axios.post('question/add', { ...data });
    }
}
