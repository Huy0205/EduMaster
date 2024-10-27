import bcrypt from 'bcrypt';

export class BcryptUtil {
    static hashPassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, 10);
    };

    static comparePassword = async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    };
}
