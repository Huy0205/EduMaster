import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Course } from './course';
import { Quiz } from './quiz';
import { Lesson } from './lesson';

@Entity()
export class Topic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    orderInCourse: number;

    @ManyToOne(() => Course, (course) => course.topics)
    course: Course;

    @OneToMany(() => Quiz, (quiz) => quiz.topic)
    quizzes: Quiz[];

    @OneToMany(() => Lesson, (lesson) => lesson.topic)
    lessons: Lesson[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
