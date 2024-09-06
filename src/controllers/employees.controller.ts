import { Request, Response } from 'express';
import { employeesModel } from '../models/employees.model';

export const employeesController = {
    // Get employees, optionally filtered by cafe and sorted by days worked
    getEmployees: async (req: Request, res: Response): Promise<void> => {
        const cafe = req.query.cafe as string; // Optional cafe query parameter

        try {
            const employees = await employeesModel.getEmployees(cafe);

            if (employees.length > 0) {
                res.status(200).json(employees);
            } else {
                res.status(200).json([]);  // Return an empty list if no employees are found
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
};
