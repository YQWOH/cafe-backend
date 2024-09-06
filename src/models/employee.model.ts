import { initializeDB } from '../db';

let pool: any; // Declare pool globally

// Initialize pool asynchronously
(async () => {
    pool = await initializeDB();
})();

export const employeeModel = {
    // Get employees filtered by cafe and sorted by days worked
    getEmployees: async (cafe?: string) => {
        let query = `
            SELECT employees.id, employees.name, employees.email_address, employees.phone_number, 
                   DATEDIFF(CURDATE(), employee_cafe.start_date) AS days_worked, 
                   cafes.name AS cafe
            FROM employees
            LEFT JOIN employee_cafe ON employees.id = employee_cafe.employee_id
            LEFT JOIN cafes ON cafes.id = employee_cafe.cafe_id
        `;

        const params: string[] = [];

        if (cafe) {
            query += ' WHERE cafes.name = ?';
            params.push(cafe);
        }

        query += ' ORDER BY days_worked DESC';

        const [rows]: any = await pool.query(query, params);
        return rows;
    },

    // Get employee by ID
    getById: async (id: string) => {
        const [rows]: any = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
        return rows[0]; // Assuming the ID is unique
    },

    // Create a new employee
    create: async (employeeData: { id: string; name: string; email_address: string; phone_number: string; gender: string }) => {
        const { id, name, email_address, phone_number, gender } = employeeData;

        // Insert employee data without capturing the result
        await pool.query(
            'INSERT INTO employees (id, name, email_address, phone_number, gender) VALUES (?, ?, ?, ?, ?)',
            [id, name, email_address, phone_number, gender]
        );

        // Return the inserted employee data
        return employeeData;
    },

    // Assign an employee to a cafe
    assignToCafe: async (employee_id: string, cafe_id: string, start_date: string) => {
        await pool.query(
            'INSERT INTO employee_cafe (employee_id, cafe_id, start_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE start_date = VALUES(start_date)',
            [employee_id, cafe_id, start_date]
        );
    },

    // Update an employee
    update: async (id: string, employeeData: { name?: string; email_address?: string; phone_number?: string; gender?: string }) => {
        const { name, email_address, phone_number, gender } = employeeData;
        const [result]: any = await pool.query(
            'UPDATE employees SET name = ?, email_address = ?, phone_number = ?, gender = ? WHERE id = ?',
            [name, email_address, phone_number, gender, id]
        );
        return result.affectedRows ? { id, ...employeeData } : null;
    },

    // Delete an employee by ID
    delete: async (id: string) => {
        const [result]: any = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
        return result.affectedRows ? true : false;
    },
};
