import 'reflect-metadata'
import { DataSource } from 'typeorm';
import { Medico } from '../entities/Medico';
import { Paciente } from '../entities/Patient';
import { Agendamento } from '../entities/Agendamento';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sua_senha',
  database: 'clinica',
  synchronize: true,
  logging: false,
  entities: [Medico, Paciente, Agendamento],
});