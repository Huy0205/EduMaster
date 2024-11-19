import axios from '~/util/axios.customize';

export class TopicService {
    static async getTopicsByCourse(courseId: string, role?: number) {
        const headers = role !== undefined ? { role } : {};
        return await axios.get(`/topic/course/${courseId}`, {
            headers,
        });
    }

    static async getTopicByGrade(grade: number) {
        return await axios.get(`/topic/grade/${grade}`);
    }
}
