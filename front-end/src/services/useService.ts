import axios from '~/util/axios.customize';

export class UserService {
    static async getUserByRole(role: number) {
        return axios.get(`user/role/${role}`);
    }

    // Add more methods here
}
