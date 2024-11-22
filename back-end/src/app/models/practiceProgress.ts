import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { Practice } from './practice';

@Entity()
export class PracticeProgress {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    practiceId: string;

    @ManyToOne(() => User, (user) => user.practiceProgress)
    user: User;

    @ManyToOne(() => Practice, (practice) => practice.practiceProgress)
    practice: Practice;

    @Column({
        default: 0,
    })
    lastQuestionIndex: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
