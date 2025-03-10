import axios from '~/util/axios.customize';

export class UserService {
    public static getUsersByRole(role: number) {
        return axios.get(`user/role/${role}`);
    }

    public static login(email: string, password: string) {
        return axios.post('user/login', { email, password });
    }

    public static auth() {
        return axios.get('user/auth');
    }

    public static getUsersByGrade(grade: number) {
        return axios.get(`user/grade/${grade}`);
    }

    public static updateUser(
        userId: string,
        data: {
            password?: string;
            fullName?: string;
            phoneNumber?: string;
            avatar?: string;
            currentGrade?: number;
            totalPoint?: number;
            status?: -1 | 0 | 1;
        },
    ) {
        return axios.put(`user/update/${userId}`, data);
    }

    public static countStudent() {
        return axios.get('user/student/count');
    }

    public static getNewUsersPerMonth(startMonth: string, endMonth: string) {
        return axios.get('user/student/new-per-month', { params: { startMonth, endMonth } });
    }
}
