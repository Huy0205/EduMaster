import axios from '~/util/axios.customize';

export class LessonService {
    public static getAllLessons() {
        return axios.get('lesson/list');
    }

    public static getLessonsByGrade(grade: number) {
        return axios.get(`lesson/grade/${grade}`);
    }

    public static getLessonsByCourse(courseId: string) {
        return axios.get(`lesson/course/${courseId}`);
    }

    public static getLessonsByTopic(topicId: string, role?: 0 | 1) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`lesson/topic/${topicId}`, {
            headers,
        });
    }

    public static getLessonById(lessonId: string) {
        return axios.get(`lesson/${lessonId}`);
    }

    public static addLesson(data: { lessonName: string; topicId: string }) {
        return axios.post('lesson/add', data);
    }

    public static updateLesson(
        lessonId: string,
        data: { lessonName?: string; status?: -1 | 0 | 1 },
    ) {
        return axios.put(`lesson/update/${lessonId}`, data);
    }
}
