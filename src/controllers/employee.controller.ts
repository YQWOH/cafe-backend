import { Request, Response } from 'express';
import { employeeModel } from '../models/employee.model';

export const employeeController = {
    // Get employees, optionally filtered by cafe and sorted by days worked
    getEmployees: async (req: Request, res: Response): Promise<void> => {
        const cafe = req.query.cafe as string; // Optional cafe query parameter
        try {
            const employees = await employeeModel.getEmployees(cafe);
            res.status(200).json(employees);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get employee by ID
    getEmployeeById: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const employee = await employeeModel.getById(id);
            if (employee) {
                res.status(200).json(employee);
            } else {
                res.status(404).json({ message: 'Employee not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new employee and establish the relationship with a cafe
    createEmployee: async (req: Request, res: Response): Promise<void> => {
        const { id, name, email_address, phone_number, gender, cafe_id, start_date } = req.body;

        try {
            const newEmployee = await employeeModel.create({ id, name, email_address, phone_number, gender });
            if (cafe_id && start_date) {
                await employeeModel.assignToCafe(newEmployee.id, cafe_id, start_date);
            }
            res.status(201).json(newEmployee);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update an employee and their relationship with a cafe
    updateEmployee: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { name, email_address, phone_number, gender, cafe_id, start_date } = req.body;

        try {
            const updatedEmployee = await employeeModel.update(id, { name, email_address, phone_number, gender });
            if (cafe_id && start_date) {
                await employeeModel.assignToCafe(id, cafe_id, start_date);
            }
            res.status(200).json(updatedEmployee);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete an employee from the database
    deleteEmployee: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const deleted = await employeeModel.delete(id);
            if (deleted) {
                res.status(200).json({ message: 'Employee deleted' });
            } else {
                res.status(404).json({ message: 'Employee not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
};
