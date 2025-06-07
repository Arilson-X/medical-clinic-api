import 'reflect-metadata'
import { DataSource } from 'typeorm';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { Appointment } from '../entities/Appointment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sua_senha',
  database: 'clinica',
  synchronize: true,
  logging: false,
  entities: [Doctor, Patient, Appointment],
});