import { Router } from 'express';
import { AppDataSource } from '../database/data-source';
import { Patient } from '../entities/Patient';

const router = Router();

router.post('/', async (req, res) => {
    const repo = AppDataSource.getRepository(Patient);
    const patient = repo.create(req.body);
    await repo.save(patient);
    return res.status(201).json(patient);
});

export default router;