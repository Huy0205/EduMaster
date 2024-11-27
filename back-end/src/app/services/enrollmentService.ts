import { db } from '~/configs';
import { Enrollment } from '~/app/models';

const EnrollmentRepository = db.AppDataSource.getRepository(Enrollment);

export class EnrollmentService {
    public static async addEnrollment(userId: string, courseId: string) {
        try {
            const enrollment = await EnrollmentRepository.save({
                userId,
                courseId,
            });
            return {
                code: 201,
                message: 'Add enrollment success',
                data: enrollment,
            };
        } catch (error) {
            console.log('Error adding enrollment', error);
            throw error;
        }
    }
}
