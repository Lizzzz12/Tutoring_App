import connection from "../models/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const teacherController = {};

// Get all teachers
teacherController.getAll = (req, res) => {
    const sql = "SELECT * FROM teacher";
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
                message: "Teachers fetched successfully",
                data: result,
            });
        }
    });
};

// Register teacher
teacherController.register = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, address, description, img_url, subject, price, availability, tutoring_location, username, password } = req.body;

        if (!firstname || !lastname || !email || !username || !password) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const userCheck = await connection.query("SELECT * FROM teacher WHERE username = $1 OR email = $2", [username, email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Username or email already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = "INSERT INTO teacher (firstname, lastname, email, phone, address, description, img_url, subject, price, availability, tutoring_location, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
        connection.query(sql, [firstname, lastname, email, phone, address, description, img_url, subject, price, availability, tutoring_location, username, hashedPassword], (error, result) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error,
                });
                throw error;
            } else {
                res.status(201).json({
                    success: true,
                    message: "Teacher registered successfully",
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

// Teacher login
teacherController.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }

        const userQuery = await connection.query("SELECT * FROM teacher WHERE username = $1", [username]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const user = userQuery.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
        console.error(err);
    }
};

// Get all teacher usernames
teacherController.getUsernames = (req, res) => {
    const sql = "SELECT username FROM teacher";
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

// Update teacher details
teacherController.update = async (req, res) => {
    try {
        const { id } = req.params;  // Assuming teacher id is passed as a URL parameter
        const { firstname, lastname, email, phone, address, description, img_url, subject, price, availability, tutoring_location, username } = req.body;

        if (!firstname || !lastname || !email || !username) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        // Ensure the username or email doesn't conflict with another teacher
        const userCheck = await connection.query("SELECT * FROM teacher WHERE (username = $1 OR email = $2) AND id != $3", [username, email, id]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Username or email already exists for another teacher" });
        }

        const sql = `
            UPDATE teacher
            SET firstname = $1, lastname = $2, email = $3, phone = $4, address = $5, description = $6, img_url = $7, subject = $8, price = $9, availability = $10, tutoring_location = $11, username = $12
            WHERE id = $13
        `;

        connection.query(sql, [firstname, lastname, email, phone, address, description, img_url, subject, price, availability, tutoring_location, username, id], (error, result) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error,
                });
                throw error;
            } else {
                res.status(200).json({
                    success: true,
                    message: "Teacher updated successfully",
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

export default teacherController;
