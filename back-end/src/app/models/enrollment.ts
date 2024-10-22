import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { Course } from './course';

@Entity()
export class Enrollment {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  courseId: string;

  @ManyToOne(() => User, (user) => user.enrollments)
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;
}
