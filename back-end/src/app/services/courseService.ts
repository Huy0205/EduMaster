import { db } from '~/configs';
import { Course } from '~/app/models';

const CourseRepository = db.AppDataSource.getRepository(Course);

export class CourseService {
    static async getAllCourses() {
        try {
            const courses = await CourseRepository.find();
            return {
                code: 200,
                message: 'Get all courses success',
                data: courses,
            };
        } catch (error) {
            console.log('Error getting all courses', error);
            throw error;
        }
    }

    static async getCoursesByGrade(grade: number) {
        try {
            const courses = await CourseRepository.find({ where: { grade } });
            return {
                code: 200,
                message: 'Get courses by grade success',
                data: courses,
            };
        } catch (error) {
            console.log('Error getting courses by grade', error);
            throw error;
        }
    }

    /**
     * Get course by ID
     * @param courseId
     * @returns
     */
    static async getCourseById(courseId: string) {
        try {
            const course = await CourseRepository.findOne({ where: { id: courseId } });
            return {
                code: 200,
                message: 'Get course success',
                data: course,
            };
        } catch (error) {
            console.log('Error getting course', error);
            throw error;
        }
    }
}
