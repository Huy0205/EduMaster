import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewProgress } from './reviewProgress';
import { Question } from './question';
import { Lecture } from './lecture';
import { Topic } from './topic';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column()
  order: number;

  @Column()
  bonusPoint: number;

  @ManyToOne(() => Topic, (topic) => topic.reviews)
  topic: Topic;

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
