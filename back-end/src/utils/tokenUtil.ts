import jwt from 'jsonwebtoken';

export const generateToken = (email: string) => {
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

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
