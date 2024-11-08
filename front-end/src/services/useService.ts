import axios from '~/util/axios.customize';

export class UserService {
    static async getUserByRole(role: number) {
        return axios.get(`user/role/${role}`);
    }

    static async login(email: string, password: string) {
        return axios.post('user/login', { email, password });
    }
}
