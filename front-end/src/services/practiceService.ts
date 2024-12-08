import axios from '~/util/axios.customize';

export class PracticeService {
    public static getAllPractices() {
        return axios.get('practice/list');
    }

    public static getPracticesByGrade(grade: number) {
        return axios.get(`practice/grade/${grade}`);
    }

    public static getPracticesByCourse(courseId: string) {
        return axios.get(`practice/course/${courseId}`);
    }

    public static getPracticesByTopic(topicId: string) {
        return axios.get(`practice/topic/${topicId}`);
    }

    public static getPracticesByLesson(lessonId: string, role?: 0 | 1) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`practice/lesson/${lessonId}`, {
            headers,
        });
    }
}
