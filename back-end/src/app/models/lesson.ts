import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Question } from './question';
import { Topic } from './topic';
import { Practice } from './practice';
import { Theory } from './theory';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({ nullable: false })
    orderInTopic: number;

    @ManyToOne(() => Topic, (topic) => topic.lessons)
    topic: Topic;

    @OneToMany(() => Practice, (practice) => practice.lesson)
    practices: Practice[];

    @OneToMany(() => Question, (question) => question.lesson)
    questions: Question[];

    @OneToMany(() => Theory, (theory) => theory.lesson)
    theories: Theory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
