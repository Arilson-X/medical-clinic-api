import { Router } from 'express';
import { AppDataSource } from '../database/data-source';
import { Appointment } from '../entities/Appointment';

const router = Router();

router.post('/', async (req, res) => {
    const repo = AppDataSource.getRepository(Appointment);
    const appointment = repo.create(req.body);
    await repo.save(appointment);
    return res.status(201).json(appointment);
});

export default router;