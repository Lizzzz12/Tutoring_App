import dotenv from "dotenv";
import express from "express";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Middleware to authenticate users
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

//---------------------- STUDENTS ----------------------------------------------------

// GET all students
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM student");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// REGISTER students
app.post("/student_register", async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;
    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const userCheck = await pool.query(
      "SELECT * FROM student WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Student already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO student (firstname, lastname, email, username, password) VALUES ($1, $2, $3, $4, $5)",
      [firstname, lastname, email, username, hashedPassword]
    );
    
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN students
app.post("/student_auth", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const userCheck = await pool.query("SELECT * FROM student WHERE username = $1", [username]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const student = userCheck.rows[0];
    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: student.id, username: student.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged In", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//---------------------- TEACHERS ----------------------------------------------------

// REGISTER teachers
app.post("/register_teachers", async (req, res) => {
  try {
    const { firstname, lastname, email, username, password, phone, address, description, image, subject, price, availability, tutoring_location } = req.body;
    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    
    const userCheck = await pool.query(
      "SELECT * FROM teacher WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO teacher (firstname, lastname, email, phone, address, description, image, subject, price, availability, tutoring_location, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      [firstname, lastname, email, phone, address, description, image, subject, price, availability, tutoring_location, username, hashedPassword]
    );
    
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET user profile (student or teacher)
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const studentResult = await pool.query("SELECT id, firstname, lastname, email, username FROM student WHERE id = $1", [id]);
    if (studentResult.rows.length > 0) {
      return res.json({ role: "student", ...studentResult.rows[0] });
    }
    
    const teacherResult = await pool.query("SELECT id, firstname, lastname, email, username, subject, price FROM teacher WHERE id = $1", [id]);
    if (teacherResult.rows.length > 0) {
      return res.json({ role: "teacher", ...teacherResult.rows[0] });
    }
    
    res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});