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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  avatar: string;

  @Column()
  currentGrade: number;

  @Column()
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
