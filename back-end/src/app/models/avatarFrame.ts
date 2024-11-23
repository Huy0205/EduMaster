import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AvatarFrameUser } from './avatarFrameUser';

@Entity()
export class AvatarFrame {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column()
    name: string;

    @Column()
    point: number;

    @OneToMany(() => AvatarFrameUser, (avatarFrameUser) => avatarFrameUser.avatarFrame)
    avatarFrameUsers: AvatarFrameUser[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
