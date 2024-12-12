import { db } from '../../configs';
import { AvatarFrameUser } from '../../app/models';

const AvatarFrameUserRepository = db.AppDataSource.getRepository(AvatarFrameUser);

export class AvatarFrameUserService {
    /**
     * Get avatar frame user by user id
     * @param userId
     * @returns
     */
    public static async getAvatarFrameUsersByUser(userId: string) {
        try {
            const avatarFrameUsers = await AvatarFrameUserRepository.find({ where: { userId } });
            return {
                code: 200,
                message: 'Get all avatar frames user success',
                data: avatarFrameUsers,
            };
        } catch (error) {
            console.log('Error getting all avatar frames user', error);
            throw error;
        }
    }

    /**
     * Add avatar frame user
     * @param avatarFrameUser
     * @returns
     */
    public static async addAvatarFrameUser(avatarFrameUser: Partial<AvatarFrameUser>) {
        try {
            const newAvatarFrameUser = await AvatarFrameUserRepository.save(avatarFrameUser);
            return {
                code: 200,
                message: 'Add avatar frame user success',
                data: newAvatarFrameUser,
            };
        } catch (error) {
            console.log('Error adding avatar frame user', error);
            throw error;
        }
    }

    /**
     * Update all is active to false by user id
     * @param userId
     * @returns
     */
    public static async updateAllIsActiveFalse(userId: string) {
        try {
            await AvatarFrameUserRepository.createQueryBuilder()
                .update()
                .set({ isActive: false })
                .where('userId = :userId', { userId })
                .execute();
            return {
                code: 200,
                message: 'Update all active false success',
            };
        } catch (error) {
            console.log('Error updating all active false', error);
            throw error;
        }
    }

    /**
     * Update is active true by avatar frame, set all other avatar frame to false
     * @param userId
     * @param avatarFrameId
     * @returns
     */
    public static async updateIsActiveTrueByAvatarFrame(userId: string, avatarFrameId: string) {
        try {
            await AvatarFrameUserRepository.createQueryBuilder()
                .update()
                .where('userId = :userId', { userId })
                .set({
                    isActive: () => `
                    CASE
                        WHEN "avatarFrameId" = :idParam THEN true
                        ELSE false
                    END
                    `,
                })
                .setParameter('idParam', avatarFrameId)
                .execute();
            return {
                code: 200,
                message: 'Update is active true by avatar frame success',
            };
        } catch (error) {
            console.log('Error updating is active true by avatar frame', error);
            throw error;
        }
    }
}
