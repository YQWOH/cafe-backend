import { initializeDB } from '../db';

let pool: any; // Declare pool globally

// Initialize pool asynchronously
(async () => {
    pool = await initializeDB();
})();

export const cafeModel = {
    // Get all cafes
    getAll: async () => {
        const [rows]: any = await pool.query('SELECT * FROM cafes');
        return rows;
    },

    // Get cafe by ID
    getById: async (id: string) => {
        const [rows]: any = await pool.query('SELECT * FROM cafes WHERE id = ?', [id]);
        return rows[0]; // Assuming the ID is unique
    },

    // Create a new cafe
    create: async (cafeData: { name: string; description: string; location: string; logo?: string }) => {
        const { name, description, location, logo } = cafeData;
        const [result]: any = await pool.query(
            'INSERT INTO cafes (name, description, location, logo) VALUES (?, ?, ?, ?)',
            [name, description, location, logo || null]
        );
        return { id: result.insertId, ...cafeData };
    },

    // Update a cafe by ID
    update: async (id: string, cafeData: { name?: string; description?: string; location?: string; logo?: string }) => {
        const { name, description, location, logo } = cafeData;
        const [result]: any = await pool.query(
            'UPDATE cafes SET name = ?, description = ?, location = ?, logo = ? WHERE id = ?',
            [name, description, location, logo || null, id]
        );
        return result.affectedRows ? { id, ...cafeData } : null;
    },

    // Delete employees associated with a cafe
    deleteEmployeesByCafe: async (cafeId: string) => {
        await pool.query('DELETE FROM employees WHERE id IN (SELECT employee_id FROM employee_cafe WHERE cafe_id = ?)', [cafeId]);
    },

    // Delete a cafe by ID
    delete: async (id: string) => {
        const [result]: any = await pool.query('DELETE FROM cafes WHERE id = ?', [id]);
        return result.affectedRows ? true : false;
    },
};
