import express, { Request, Response } from 'express';
import { cafesModel } from '../models/cafes.model';
const router = express.Router();


export const cafesController = {
    // Get all cafes
    getCafes: async (req: Request, res: Response): Promise<void> => {
        const location = req.query.location as string;

        try {
            const cafes = await cafesModel.getCafes(location);

            if (cafes.length > 0) {
                res.status(200).json(cafes);
            } else {
                res.status(200).json([]);  // Return an empty list if no cafes are found
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
}



// GET cafes by location
// router.get('/', async (req: Request, res: Response): Promise<void> => {
//     const location: string = (req.query.location as string) || ''; // Ensure location is a string
//     try {
//         let query = `
//             SELECT cafes.*, COUNT(employee_cafe.employee_id) AS employees 
//             FROM cafes 
//             LEFT JOIN employee_cafe ON cafes.id = employee_cafe.cafe_id
//         `;
//         const params: string[] = [];
//         if (location) {
//             query += ' WHERE cafes.location = ?';
//             params.push(location);
//         }
//         query += ' GROUP BY cafes.id ORDER BY employees DESC';

//         const [cafes] = await pool.query(query, params);
//         res.json(cafes);
//     } catch (err: any) {
//         res.status(500).json({ error: err.message });
//     }
// });

export default router;