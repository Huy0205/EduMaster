import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Course,
  Enrollment,
  User,
  Review,
  ReviewProgress,
  Topic,
  Quiz,
  QuizProgress,
  Question,
  Answer,
  Lecture,
  LectureType,
  QuizQuestion,
} from '~/app/models';

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Course,
    Enrollment,
    Review,
    ReviewProgress,
    Topic,
    Quiz,
    QuizProgress,
    Question,
    Answer,
    Lecture,
    LectureType,
    QuizQuestion,
  ],
  migrations: [],
  subscribers: [],
});

const connect = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
  } catch (error) {
    console.log('Error connecting to database', error);
    process.exit(1);
  }
};

export { AppDataSource, connect };
