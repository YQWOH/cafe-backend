import mysql, { Pool } from 'mysql2/promise';

// Function to initialize and check the DB
export const initializeDB = async (): Promise<Pool> => {
    const poolWithoutDB = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'your-password',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    const connection = await poolWithoutDB.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS cafe_manager');
    connection.release();

    const poolWithDB = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'your-password',
        database: 'cafe_manager',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    return poolWithDB;
};

// Create necessary tables if they don't exist
// export const createTables = async (pool: Pool) => {
//     const connection = await pool.getConnection();

//     // Create cafes table
//     await connection.query(`
//         CREATE TABLE IF NOT EXISTS cafes (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             description TEXT,
//             location VARCHAR(255),
//             logo VARCHAR(255)
//         );
//     `);

//     // Create employees table
//     await connection.query(`
//         CREATE TABLE IF NOT EXISTS employees (
//             id VARCHAR(10) PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             email_address VARCHAR(255),
//             phone_number VARCHAR(15),
//             gender ENUM('Male', 'Female') NOT NULL
//         );
//     `);

//     // Create employee_cafe relationship table
//     await connection.query(`
//         CREATE TABLE IF NOT EXISTS employee_cafe (
//             employee_id VARCHAR(10),
//             cafe_id INT,
//             start_date DATE,
//             FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
//             FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
//         );
//     `);

//     connection.release();
//     console.log('Tables ensured to exist');
// };
export const createTables = async (pool: Pool) => {
    const connection = await pool.getConnection();

    // Create cafes table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS cafes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            logo VARCHAR(255)
        );
    `);

    // Create employees table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS employees (
            id VARCHAR(10) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email_address VARCHAR(255),
            phone_number VARCHAR(15),
            gender ENUM('Male', 'Female') NOT NULL
        );
    `);

    // Create employee_cafe table with a composite unique key (employee_id + cafe_id)
    await connection.query(`
        CREATE TABLE IF NOT EXISTS employee_cafe (
            employee_id VARCHAR(10),
            cafe_id INT,
            start_date DATE,
            PRIMARY KEY (employee_id, cafe_id),  -- Composite primary key to prevent duplicates
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
            FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
        );
    `);

    connection.release();
    console.log('Tables ensured to exist');
};


// Seed data function
export const seedData = async (pool: Pool) => {
    const connection = await pool.getConnection();

    // Seed cafes data using INSERT IGNORE to avoid duplicate key errors
    await connection.query(`
        INSERT IGNORE INTO cafes (id, name, description, location) VALUES 
        (1, 'Cafe Java', 'A cozy cafe for developers', 'San Francisco'),
        (2, 'Cafe Latte', 'The perfect place for coffee lovers', 'New York');
    `);

    // Seed employees data using INSERT IGNORE
    await connection.query(`
        INSERT IGNORE INTO employees (id, name, email_address, phone_number, gender) VALUES
        ('UI1234567', 'John Doe', 'john.doe@example.com', '91234567', 'Male'),
        ('UI7654321', 'Jane Smith', 'jane.smith@example.com', '81234567', 'Female');
    `);

    // Seed employee_cafe data using ON DUPLICATE KEY UPDATE
    await connection.query(`
        INSERT INTO employee_cafe (employee_id, cafe_id, start_date) VALUES
        ('UI1234567', 1, '2023-01-01'),
        ('UI7654321', 2, '2023-02-01')
        ON DUPLICATE KEY UPDATE start_date = VALUES(start_date);
    `);

    connection.release();
    console.log('Seed data inserted (with relationship handling)');
};