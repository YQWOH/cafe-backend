import express from 'express';
import { cafesController } from '../controllers/cafes.controller';
export const router = express.Router();


router.get('/', async (req, res) => {
    await cafesController.getCafes(req, res);
});