import { db } from '~/configs';
import { Practice } from '~/app/models';

const PracticeRepository = db.AppDataSource.getRepository(Practice);

export class PracticeService {
    // public static async getAllPractices(): Promise<Practice[]> {}

    /**
     * Get practices by lesson id
     * @param lessonId
     * @returns
     */
    public static async getPracticesByLesson(lessonId: string) {
        try {
            const practices = await PracticeRepository.find({
                where: {
                    lesson: {
                        id: lessonId,
                    },
                },
                order: {
                    orderInLesson: 'ASC',
                },
            });

            return {
                code: 200,
                message: 'Get practices by lesson successfully',
                data: practices,
            };
        } catch (error) {
            console.error('Error getting practices by lesson', error);
            throw error;
        }
    }
}
