import { db } from '../../configs';
import { AvatarFrame } from '../../app/models';

const AvatarFrameRepository = db.AppDataSource.getRepository(AvatarFrame);

export class AvatarFrameService {
    /**
     * Get all avatar frames
     * @returns
     */
    public static async getAllAvatarFrames() {
        try {
            const response = await AvatarFrameRepository.find();
            return {
                code: 200,
                message: 'Get all avatar frames success',
                data: response,
            };
        } catch (error) {
            console.log('Error getting all avatar frames', error);
            throw error;
        }
    }

    /**
     * Get avatar frame by id
     * @param id
     * @returns
     */
    public static async getAvatarFrameById(avatarFrameId: string) {
        try {
            const response = await AvatarFrameRepository.findOne({
                where: {
                    id: avatarFrameId,
                },
            });
            return {
                code: 200,
                message: 'Get avatar frame by id success',
                data: response,
            };
        } catch (error) {
            console.log('Error getting avatar frame by id', error);
            throw error;
        }
    }
}
