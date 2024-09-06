import express from "express";
import { initializeDB, seedData, createTables } from './db'; // Import DB initialization
const app = express();
import { router as cafesRoutes } from "./routes/cafes.route";
import { router as cafeRoutes } from "./routes/cafe.route";
import { router as employeesRoutes } from "./routes/employees.route";
import { router as employeeRoutes } from "./routes/employee.route";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file?.filename);
});

app.use("/api/cafes", cafesRoutes);
app.use("/api/cafe", cafeRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/employee", employeeRoutes);

// Initialize database, create tables, and seed data
initializeDB()
    .then(async (pool) => {
        // Ensure the tables are created before seeding data
        await createTables(pool);

        // Optionally run seed data after DB is initialized
        await seedData(pool);

        // Start the server after the database is initialized
        app.listen(8800, () => {
            console.log("API working!");
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database", error);
        process.exit(1); // Exit the process if the DB initialization fails
    });
