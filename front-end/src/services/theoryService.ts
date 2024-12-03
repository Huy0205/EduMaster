import axios from '~/util/axios.customize';

export class TheoryService {
    public static getAllTheories() {
        return axios.get('theory/list');
    }

    public static getTheoriesByGrade(grade: number) {
        return axios.get(`theory/grade/${grade}`);
    }

    public static getTheoriesByCourse(courseId: string) {
        return axios.get(`theory/course/${courseId}`);
    }

    public static getTheoriesByTopic(topicId: string) {
        return axios.get(`theory/topic/${topicId}`);
    }

    public static getTheoriesByLesson(lessonId: string, role?: 0 | 1) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`theory/lesson/${lessonId}`, {
            headers,
        });
    }

    public static addTheory(data: {
        title: string;
        url: string;
        description?: string;
        lessonId: string;
    }) {
        return axios.post('theory/add', data);
    }

    public static updateTheory(
        theoryId: string,
        data: {
            title?: string;
            url?: string;
            description?: string;
            status?: -1 | 0 | 1;
        },
    ) {
        return axios.put(`theory/update/${theoryId}`, data);
    }
}
