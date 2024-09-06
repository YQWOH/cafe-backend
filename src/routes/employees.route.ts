import express from 'express';
import { employeesController } from '../controllers/employees.controller';

export const router = express.Router();

// Get employees, optionally filtered by cafe and sorted by days worked
router.get('/', async (req, res) => {
    await employeesController.getEmployees(req, res);
});