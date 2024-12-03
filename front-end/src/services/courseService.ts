import axios from '~/util/axios.customize';

export class CourseService {
    public static async getAllCourses() {
        return axios.get('course/list');
    }

    public static async getCoursesByGrade(grade: number) {
        return axios.get(`course/grade/${grade}`);
    }

    public static async getCourseById(courseId: string) {
        return axios.get(`course/${courseId}`);
    }

    public static async getGradeDistinct() {
        return axios.get('course/grade-distinct');
    }
}
