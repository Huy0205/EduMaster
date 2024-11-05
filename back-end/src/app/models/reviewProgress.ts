import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Review } from './review';
import { User } from './user';

@Entity()
export class ReviewProgress {
  @PrimaryColumn()
  reviewId: string;

  @PrimaryColumn()
  userId: string;

  @Column()
  lastQuestionIndex: number;

  @ManyToOne(() => Review, (review) => review.reviewProgresses)
  review: Review;

  @ManyToOne(() => User, (user) => user.reviewProgresses)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
