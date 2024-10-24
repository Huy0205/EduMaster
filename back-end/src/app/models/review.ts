import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewProgress } from './reviewProgress';
import { Question } from './question';
import { Lecture } from './lecture';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  order: number;

  @Column()
  bonusPoint: number;

  @OneToMany(() => ReviewProgress, (reviewProgress) => reviewProgress.review)
  reviewProgresses: ReviewProgress[];

  @OneToMany(() => Question, (question) => question.review)
  questions: Question[];

  @OneToMany(() => Lecture, (lecture) => lecture.review)
  lectures: Lecture[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
