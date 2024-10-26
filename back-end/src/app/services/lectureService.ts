import { db } from '~/configs';
import { Lecture } from '~/app/models';

const LectureRepository = db.AppDataSource.getRepository(Lecture);

export class LectureService {
    /**
     * Get lectures by review
     * @param reviewId
     * @returns
     */
    static async getLecturesByReview(reviewId: string) {
        try {
            const response = await LectureRepository.find({
                where: {
                    review: {
                        id: reviewId,
                    },
                },
            });
            return {
                code: 200,
                message: 'Get lectures by course success',
                data: response,
            };
        } catch (error) {
            console.log('Error getting lectures by course', error);
            throw error;
        }
    }
}
