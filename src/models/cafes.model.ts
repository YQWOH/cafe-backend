import { initializeDB } from '../db';

let pool: any; // Declare pool globally

// Initialize pool asynchronously
(async () => {
    pool = await initializeDB();
})();

export const cafesModel = {
    // Get all cafes
    getCafes: async (location?: string) => {
        let query = `
            SELECT cafes.id, cafes.name, cafes.description, cafes.logo, cafes.location, COUNT(employee_cafe.employee_id) AS employees
            FROM cafes
            LEFT JOIN employee_cafe ON cafes.id = employee_cafe.cafe_id
        `;

        const params: string[] = [];

        if (location) {
            query += ' WHERE cafes.location = ?';
            params.push(location);
        }

        query += ' GROUP BY cafes.id ORDER BY employees DESC';

        // Wait for the pool to initialize and execute the query
        const [rows]: any = await pool.query(query, params);

        return rows;  // Return the rows with the data
    },
};