import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TheoryType } from './theoryType';
import { Lesson } from './lesson';
import { Status } from '../enums';

@Entity()
export class Theory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    url: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => TheoryType, (theoryType) => theoryType.theories)
    type: TheoryType;

    @Column({ nullable: false })
    orderInLesson: number;

    @Column({ default: false })
    isViewed: boolean;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.INACTIVE,
    })
    status: Status;

    @ManyToOne(() => Lesson, (lesson) => lesson.theories)
    lesson: Lesson;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
