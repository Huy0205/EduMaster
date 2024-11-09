import axios from '~/util/axios.customize';

export class TopicService {
    static async getTopicsByCourse(courseId: string) {
        return await axios.get(`/topic/course/${courseId}`);
    }
}
