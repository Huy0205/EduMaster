import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
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
}
