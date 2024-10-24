import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LectureType } from './lectureType';
import { Review } from './review';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => LectureType, (lectureType) => lectureType.lectures)
  type: LectureType;

  @Column({ default: false })
  isViewed: boolean;

    @ManyToOne(() => Review, (review) => review.lectures)
  review: Review;
}
