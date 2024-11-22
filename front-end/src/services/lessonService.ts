import axios from '~/util/axios.customize';

export class LessonService {
    public static getAllLessons(page?: number, limit?: number) {
        return axios.get('lesson/list', { params: { page, limit } });
    }

    public static getLessonsByTopic(topicId: string, role?: number, page?: number, limit?: number) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`lesson/topic/${topicId}`, {
            headers,
            params: { page, limit },
        });
    }

    public static getLessonsByCourse(courseId: string, page?: number, limit?: number) {
        return axios.get(`lesson/course/${courseId}`, { params: { page, limit } });
    }

    public static getLessonsByGrade(grade: number, page?: number, limit?: number) {
        return axios.get(`lesson/grade/${grade}`, { params: { page, limit } });
    }
}
