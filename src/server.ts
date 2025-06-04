import express from 'express';
import { AppDataSource } from './database/data-source';
import pacientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import appointmentRoutes from './routes/appointment.routes';

const app = express();
app.use(express.json());

app.use('/patients', pacientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

AppDataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});