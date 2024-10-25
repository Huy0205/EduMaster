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
import { Review } from './review';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Course, (course) => course.topics)
  course: Course;

  @OneToMany(() => Review, (review) => review.topic)
  reviews: Review[];

  @OneToMany(() => Quiz, (quiz) => quiz.topic)
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
