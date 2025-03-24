import connection from "../models/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentController = {};

// Get all students
studentController.getAll = (req, res) => {
    const sql = "SELECT firstname, lastname, email, username FROM student";
    connection.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: error,
            });
            throw error;
        } else {
            res.status(200).json({
                success: true,
                message: "Students fetched successfully",
                data: result,
            });
        }
    });
};

// Register student
studentController.register = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password } = req.body;

        if (!firstname || !lastname || !email || !username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const studentCheck = await connection.query("SELECT * FROM student WHERE username = $1 OR email = $2", [username, email]);
        if (studentCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Student already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = "INSERT INTO student (firstname, lastname, email, username, password) VALUES ($1, $2, $3, $4, $5)";
        connection.query(sql, [firstname, lastname, email, username, hashedPassword], (error, result) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error,
                });
                throw error;
            } else {
                res.status(201).json({
                    success: true,
                    message: "Student registered successfully",
                    data: result,
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        console.error(err);
    }
};

// Student login
studentController.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        const studentCheck = await connection.query("SELECT * FROM student WHERE username = $1", [username]);
        if (studentCheck.rows.length === 0) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const student = studentCheck.rows[0];
        const passwordMatch = await bcrypt.compare(password, student.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid input" });
        }

        const token = jwt.sign(
            { id: student.id, username: student.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            message: "Logged In",
            token,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
        console.error(err);
    }
};

// Get all student usernames
studentController.getUsernames = (req, res) => {
    const sql = "SELECT username FROM student";
    connection.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: error,
            });
            throw error;
        } else {
            res.status(200).json({
                success: true,
                message: "Usernames fetched successfully",
                data: result,
            });
        }
    });
};

export default studentController;
