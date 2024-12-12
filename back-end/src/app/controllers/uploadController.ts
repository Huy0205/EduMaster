import { Request, Response } from 'express';
import { ResponseUtil } from '../../utils';

export class UploadController {
    public static uploadFile(req: Request, res: Response) {
        const { file } = req;
        if (!file) {
            ResponseUtil.sendMissingData(res);
        } else {
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            ResponseUtil.sendResponse(res, {
                code: 200,
                message: 'File uploaded successfully!',
                data: { fileUrl },
            });
        }
    }
}
