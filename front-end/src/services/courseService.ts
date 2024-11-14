import axios from '~/util/axios.customize';

export class CourseService {
    static async getAllCourses() {
        return axios.get('course/list');
    }

    static async getCoursesByGrade(grade: number) {
        return axios.get(`course/grade/${grade}`);
    }

    static async getGradeDistinct() {
        return axios.get('course/grade-distinct');
    }
}
