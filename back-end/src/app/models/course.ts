import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Enrollment } from './enrollment';
import { Topic } from './topic';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grade: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Topic, (topic) => topic.course)
  topics: Topic[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
