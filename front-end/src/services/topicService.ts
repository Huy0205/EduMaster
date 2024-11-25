import axios from '~/util/axios.customize';

export class TopicService {
    public static getAllTopics(page?: number, limit?: number) {
        return axios.get('topic/list', { params: { page, limit } });
    }

    public static getTopicByGrade(grade: number, page?: number, limit?: number) {
        return axios.get(`topic/grade/${grade}`, { params: { page, limit } });
    }

    public static getTopicsByCourse(
        courseId: string,
        role?: number,
        page?: number,
        limit?: number,
    ) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`topic/course/${courseId}`, {
            headers,
            params: { page, limit },
        });
    }

    public static addTopic(courseId: string, topicName: string) {
        return axios.post('topic/add', { topicName, courseId });
    }

    public static updateStatus(topicId: string, status: -1 | 0 | 1) {
        return axios.put(`topic/update-status/${topicId}`, { status });
    }
}
