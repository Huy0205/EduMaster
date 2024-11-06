import { Response } from 'express';

interface ResponseData {
    code: number;
    message: string;
    data?: object;
}

export class ResponseUtil {
    static sendResponse(res: Response, response: ResponseData) {
        const { code, message, data } = response;

        const jsonResponse: object = { message };
        if (data !== undefined) {
            jsonResponse['data'] = data;
        }

        res.status(code).json(jsonResponse);
    }

    static sendMissingData(res: Response) {
        this.sendResponse(res, {
            code: 400,
            message: 'Missing required fields',
        });
    }

    static sendInvalidData(res: Response) {
        this.sendResponse(res, {
            code: 400,
            message: 'Invalid data',
        });
    }
}
