import jwt from 'jsonwebtoken';

export class TokenUtil {
    static generateToken = (email: string) => {
        const token = jwt.sign(
            {
                email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE,
            },
        );
        return token;
    };

    static verifyToken = (token: string) => {
        return jwt.verify(token, process.env.JWT_SECRET);
    };
}
