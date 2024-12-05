import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Role, Status } from '../enums';
import { Enrollment } from './enrollment';
import { PracticeProgress } from './practiceProgress';
import { Result } from './result';
import { AvatarFrameUser } from './avatarFrameUser';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        unique: true,
    })
    phoneNumber: string;

    @Column()
    avatar: string;

    @Column()
    currentGrade: number;

    @Column({ default: 0 })
    totalPoint: number;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT,
        enumName: 'role',
    })
    role: Role;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
        enumName: 'status',
    })
    status: Status;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
    enrollments: Enrollment[];

    @OneToMany(() => PracticeProgress, (practiceProgress) => practiceProgress.user)
    practiceProgress: PracticeProgress[];

    @OneToMany(() => Result, (result) => result.user)
    results: Result[];

    @OneToMany(() => AvatarFrameUser, (avatarFrameUser) => avatarFrameUser.user)
    avatarFrameUsers: AvatarFrameUser[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
