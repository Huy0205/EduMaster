import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { Quiz } from './quiz';

@Entity()
export class Result {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    quizId: string;

    @Column({ nullable: true, type: 'float' })
    score: number;

    @Column({ nullable: true })
    correctCount: number;

    @ManyToOne(() => User, (user) => user.results)
    user: User;

    @ManyToOne(() => Quiz, (quiz) => quiz.results)
    quiz: Quiz;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
