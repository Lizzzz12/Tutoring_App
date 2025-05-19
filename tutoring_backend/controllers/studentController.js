import pool from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentController = {};

// Get all students
studentController.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT firstname, lastname, email, username FROM student"
    );
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("GetAll Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get student by ID
studentController.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, firstname, lastname, email, username FROM student WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("GetStudentById Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Register student
studentController.register = async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;

    if (!firstname || !lastname || !email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const checkUser = await pool.query(
      "SELECT * FROM student WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (checkUser.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO student (firstname, lastname, email, username, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, firstname, lastname, email, username
    `;
    const result = await pool.query(insertQuery, [
      firstname,
      lastname,
      email,
      username,
      hashedPassword,
    ]);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Student login
studentController.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM student WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const student = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, student.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student.id, username: student.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      student: {
        id: student.id,
        username: student.username,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Get all student usernames
studentController.getUsernames = async (req, res) => {
  try {
    const result = await pool.query("SELECT username FROM student");
    res.status(200).json({
      success: true,
      message: "Usernames fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("GetUsernames Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Change student credentials
studentController.changeCredentials = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, newUsername } = req.body;

  // 🔒 Ensure the authenticated user is modifying only their own credentials
  if (parseInt(id) !== req.studentId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  if (!currentPassword || !newPassword || !newUsername) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM student WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = result.rows[0];
    const passwordMatch = await bcrypt.compare(currentPassword, student.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if username is already taken by another student
    const usernameCheck = await pool.query(
      'SELECT * FROM student WHERE username = $1 AND id != $2',
      [newUsername, id]
    );
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const updateQuery = `
      UPDATE student
      SET password = $1, username = $2
      WHERE id = $3
    `;
    await pool.query(updateQuery, [hashedPassword, newUsername, id]);

    res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Error updating student credentials:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export default studentController;
