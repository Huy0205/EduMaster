import axios from '~/util/axios.customize';

export class TopicService {
    public static getAllTopics() {
        return axios.get('topic/list');
    }

    public static getTopicByGrade(grade: number) {
        return axios.get(`topic/grade/${grade}`);
    }

    public static getTopicsByCourse(courseId: string, role?: 0 | 1) {
        const headers = role !== undefined ? { role } : {};
        return axios.get(`topic/course/${courseId}`, {
            headers,
        });
    }

    public static addTopic(data: { topicName: string; courseId: string }) {
        return axios.post('topic/add', data);
    }

    public static updateTopic(topicId: string, data: { topicName?: string; status?: -1 | 0 | 1 }) {
        return axios.put(`topic/update/${topicId}`, data);
    }
}
