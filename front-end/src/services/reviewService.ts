import axios from '~/util/axios.customize';

export class ReviewService {
    static getReviewsByTopic(topicId: string) {
        return axios.get(`/review/topic/${topicId}`);
    }
}
