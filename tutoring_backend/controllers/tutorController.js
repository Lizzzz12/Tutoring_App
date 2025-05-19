import connection from "../models/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const teacherController = {};

// Get all teachers
teacherController.getAll = async (req, res) => {
    try {
        const sql = "SELECT * FROM teacher";
        const result = await connection.query(sql);
        
        res.status(200).json({
            success: true,
            message: "Teachers fetched successfully",
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
        console.error(error);
    }
};

// Register teacher
teacherController.register = async (req, res) => {
    try {
        const {
            firstname, lastname, email, phone, address,
            description, img_url, subject, price, availability,
            tutoring_location, username, password
        } = req.body;

        if (!firstname || !lastname || !email || !username || !password) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        // Check if username or email already exists
        const userCheckQuery = "SELECT * FROM teacher WHERE username = $1 OR email = $2";
        const userCheckResult = await connection.query(userCheckQuery, [username, email]);

        if (userCheckResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Username or email already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new teacher into the database
        const insertQuery = `
            INSERT INTO teacher (
                firstname, lastname, email, phone, address,
                description, img_url, subject, price, availability,
                tutoring_location, username, password
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13
            )
        `;
        const values = [
            firstname, lastname, email, phone, address,
            description, img_url, subject, price, availability,
            tutoring_location, username, hashedPassword
        ];

        await connection.query(insertQuery, values);

        res.status(201).json({
            success: true,
            message: "Teacher registered successfully"
        });
    } catch (err) {
        console.error("Error during teacher registration:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Teacher login
teacherController.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }

        const userQuery = "SELECT * FROM teacher WHERE username = $1";
        const userResult = await connection.query(userQuery, [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            teacher: user,
        });

    } catch (err) {
        console.error("Error during teacher login:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all teacher usernames
teacherController.getUsernames = async (req, res) => {
    try {
        const sql = "SELECT username FROM teacher";
        const result = await connection.query(sql);

        res.status(200).json({
            success: true,
            message: "Usernames fetched successfully",
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
        console.error(error);
    }
};

// Update teacher details
teacherController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstname, lastname, email, phone, address,
            description, img_url, subject, price, availability,
            tutoring_location, username
        } = req.body;

        if (!firstname || !lastname || !email || !username) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const userCheckQuery = "SELECT * FROM teacher WHERE (username = $1 OR email = $2) AND id != $3";
        const userCheckResult = await connection.query(userCheckQuery, [username, email, id]);

        if (userCheckResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Username or email already exists for another teacher" });
        }

        const updateQuery = `
            UPDATE teacher
            SET firstname = $1, lastname = $2, email = $3, phone = $4, address = $5, description = $6, img_url = $7, subject = $8, price = $9, availability = $10, tutoring_location = $11, username = $12
            WHERE id = $13
        `;
        const updateValues = [
            firstname, lastname, email, phone, address,
            description, img_url, subject, price, availability,
            tutoring_location, username, id
        ];

        await connection.query(updateQuery, updateValues);

        res.status(200).json({
            success: true,
            message: "Teacher updated successfully"
        });

    } catch (err) {
        console.error("Error during teacher update:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get teacher by ID
teacherController.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = "SELECT * FROM teacher WHERE id = $1";
        const result = await connection.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Teacher fetched successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error fetching teacher by ID:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Overal Rating
teacherController.getTeacherOverallRating = async (req, res) => {
  const teacherId = parseInt(req.params.id, 10);

  if (isNaN(teacherId)) {
    return res.status(400).json({ success: false, message: 'Invalid teacher ID' });
  }

  try {
    const query = `
      SELECT ROUND(AVG(ar.rating)::numeric, 2) AS average_rating
      FROM teacher t
      JOIN announcements a ON t.id = a.teacher_id
      JOIN announcementreviews ar ON a.id = ar.announcement_id
      WHERE t.id = $1
    `;

    const result = await connection.query(query, [teacherId]);

    res.status(200).json({
      success: true,
      averageRating: result.rows[0].average_rating || null,
    });
  } catch (error) {
    console.error("Failed to fetch teacher's overall rating:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Change teacher credentials
teacherController.changeCredentials = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, newUsername } = req.body;

  if (!currentPassword || !newPassword || !newUsername) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const result = await connection.query('SELECT * FROM teacher WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const teacher = result.rows[0];
    const passwordMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if username is already taken by another teacher
    const usernameCheck = await connection.query('SELECT * FROM teacher WHERE username = $1 AND id != $2', [newUsername, id]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const updateQuery = `
      UPDATE teacher
      SET password = $1, username = $2
      WHERE id = $3
    `;
    await connection.query(updateQuery, [hashedPassword, newUsername, id]);

    res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Error updating teacher credentials:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export default teacherController;
