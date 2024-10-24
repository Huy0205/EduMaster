import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lecture } from './lecture';

@Entity()
export class LectureType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Lecture, (lecture) => lecture.type)
  lectures: Lecture[];
}
