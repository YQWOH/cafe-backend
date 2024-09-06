import express from 'express';
import { employeeController } from '../controllers/employee.controller';

export const router = express.Router();

// Get employees, optionally filtered by cafe and sorted by days worked
router.get('/', async (req, res) => {
    await employeeController.getEmployees(req, res);
});

// Get employee by ID
router.get('/:id', async (req, res) => {
    await employeeController.getEmployeeById(req, res);
});

// Create a new employee and establish the relationship with a cafe
router.post('/', async (req, res) => {
    await employeeController.createEmployee(req, res);
});

// Update an employee and their relationship with a cafe
router.put('/:id', async (req, res) => {
    await employeeController.updateEmployee(req, res);
});

// Delete an employee from the database
router.delete('/:id', async (req, res) => {
    await employeeController.deleteEmployee(req, res);
});
