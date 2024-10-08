import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../app/models/user';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'group110',
  database: 'EduMaster',
  synchronize: true,
  logging: false,
  entities: [User],
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
