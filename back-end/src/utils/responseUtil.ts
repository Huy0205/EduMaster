import { Response } from 'express';

interface ResponseData {
    code: number;
    message: string;
    data?: object;
}

export const sendResponse = (res: Response, response: ResponseData) => {
    const { code, message, data } = response;

    const jsonResponse: object = { message };
    if (data !== undefined) {
        jsonResponse['data'] = data;
    }

    res.status(code).json(jsonResponse);
};
