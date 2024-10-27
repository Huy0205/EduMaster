import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../enums';
import { Enrollment } from './enrollment';
import { ReviewProgress } from './reviewProgress';
import { QuizProgress } from './quizProgress';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column()
  avatar: string;

  @Column()
  currentGrade: number;

  @Column({ default: 0 })
  totalPoint: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
    enumName: 'role',
  })
  role: Role;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => ReviewProgress, (reviewProgress) => reviewProgress.user)
  reviewProgresses: ReviewProgress[];

  @OneToMany(() => QuizProgress, (quizProgress) => quizProgress.user)
  quizProgress: QuizProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
