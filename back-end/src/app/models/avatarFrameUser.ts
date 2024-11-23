import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user';
import { AvatarFrame } from './avatarFrame';

@Entity()
export class AvatarFrameUser {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    avatarFrameId: string;

    @Column()
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.avatarFrameUsers)
    user: User;

    @ManyToOne(() => AvatarFrame, (avatarFrame) => avatarFrame.avatarFrameUsers)
    avatarFrame: AvatarFrame;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
