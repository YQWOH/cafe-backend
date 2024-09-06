import express from 'express';
import { cafeController } from '../controllers/cafe.controller';
export const router = express.Router();

// Get all cafes
router.get('/', async (req, res) => {
    await cafeController.getAllCafes(req, res);
});

// Get cafe by ID
router.get('/:id', async (req, res) => {
    await cafeController.getCafeById(req, res);
});

// Create a new cafe
router.post('/', async (req, res) => {
    await cafeController.createCafe(req, res);
});

// Update a cafe by ID
router.put('/:id', async (req, res) => {
    await cafeController.updateCafe(req, res);
});

// Delete a cafe by ID (and also delete all employees under that cafe)
router.delete('/:id', async (req, res) => {
    await cafeController.deleteCafe(req, res);
});
