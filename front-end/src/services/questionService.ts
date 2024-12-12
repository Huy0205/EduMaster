import axios from '~/util/axios.customize';

export class QuestionService {
    public static getAllQuestions(isQuizQuestion: boolean) {
        return axios.get('question/list', { params: { isQuizQuestion } });
    }

    public static getQuestionsByGrade(isQuizQuestion: boolean, grade: number) {
        return axios.get(`question/grade/${grade}`, { params: { isQuizQuestion } });
    }

    public static getQuestionsByCourse(isQuizQuestion: boolean, courseId: string) {
        return axios.get(`question/course/${courseId}`, {
            params: { isQuizQuestion },
        });
    }

    public static getQuestionsByTopic(isQuizQuestion: boolean, topicId: string) {
        return axios.get(`question/topic/${topicId}`, { params: { isQuizQuestion } });
    }

    public static getQuestionsByLesson(lessonId: string) {
        return axios.get(`question/lesson/${lessonId}`);
    }

    public static getQuestionsByPractice(practiceId: string) {
        return axios.get(`question/practice/${practiceId}`);
    }

    public static getQuestionsByQuiz(quizId: string) {
        return axios.get(`question/quiz/${quizId}`);
    }

    public static getQuestionById(questionId: string) {
        return axios.get(`question/${questionId}`);
    }

    public static addQuestion(data: {
        content: string;
        image: string;
        type: 1 | 2 | 3;
        feedback: string;
        status?: -1 | 0 | 1;
        topicId: string;
        lessonId?: string | null;
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
            status?: -1 | 0 | 1;
        },
    ) {
        return axios.put(`question/update/${id}`, data);
    }
}
