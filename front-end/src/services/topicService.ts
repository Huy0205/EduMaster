import axios from '~/util/axios.customize';

export class TopicService {
    public static async getAllTopics() {
        return await axios.get('/topic/list');
    }

    public static async getTopicsByCourse(courseId: string, role?: number) {
        const headers = role !== undefined ? { role } : {};
        return await axios.get(`/topic/course/${courseId}`, {
            headers,
        });
    }

    public static async getTopicByGrade(grade: number) {
        return await axios.get(`/topic/grade/${grade}`);
    }
}
