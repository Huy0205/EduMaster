import { getApiNoneToken } from '~/api/page';

export interface User {
    id: string;
    name: string;
    email: string;
    frame?: AvatarFrame;
    currentGrade: number;
}

export interface AvatarFrame {
    id: string;
    name: string;
    url: string;
    point: number;
}

export const fetchUserWithFrame = async (user: User | null): Promise<User | null> => {
    if (!user) return null;

    try {
        const frameResponse = await getApiNoneToken(`/avatar-frame-user/user/${user.id}`);
        const activeFrame = frameResponse.data.data.find((frame: any) => frame.isActive);

        if (activeFrame) {
            const frameDetailsResponse = await getApiNoneToken(
                `/avatar-frame/${activeFrame.avatarFrameId}`,
            );
            user.frame = frameDetailsResponse.data.data as AvatarFrame;
        }
    } catch (error) {
        console.error('Error fetching user frame:', error);
    }
    return user;
};
