import { Router } from 'express';
import { AppDataSource } from '../database/data-source';
import { Doctor } from '../entities/Doctor';

const router = Router();

router.post('/', async (req, res) => {
    const repo = AppDataSource.getRepository(Doctor);
    const doctor = repo.create(req.body);
    await repo.save(doctor);
    return res.status(201).json(doctor);
});

export default router;