import axios from '~/util/axios.customize';

export class CourseService {
    static async getCoursesByGrade(grade: number) {
        return axios.get(`course/grade/${grade}`);
    }
}
