import { Request, Response } from 'express';
import { cafeModel } from '../models/cafe.model';

export const cafeController = {
    // Get all cafes
    getAllCafes: async (req: Request, res: Response): Promise<void> => {
        try {
            const cafes = await cafeModel.getAll();
            res.status(200).json(cafes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get cafe by ID
    getCafeById: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const cafe = await cafeModel.getById(id);
            if (cafe) {
                res.status(200).json(cafe);
            } else {
                res.status(404).json({ message: 'Cafe not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new cafe
    createCafe: async (req: Request, res: Response): Promise<void> => {
        try {
            const newCafe = await cafeModel.create(req.body);
            res.status(201).json(newCafe);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a cafe by ID
    updateCafe: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const updatedCafe = await cafeModel.update(id, req.body);
            if (updatedCafe) {
                res.status(200).json(updatedCafe);
            } else {
                res.status(404).json({ message: 'Cafe not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a cafe and all associated employees
    deleteCafe: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            // First, delete employees associated with this cafe
            await cafeModel.deleteEmployeesByCafe(id);

            // Then delete the cafe itself
            const deleted = await cafeModel.delete(id);

            if (deleted) {
                res.status(200).json({ message: 'Cafe and associated employees deleted' });
            } else {
                res.status(404).json({ message: 'Cafe not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
};