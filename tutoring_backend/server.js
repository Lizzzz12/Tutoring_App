import dotenv from "dotenv";

import express from 'express';
import pool from './db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const app = express();
app.use(express.json());
dotenv.config();

//---------------------- STUDENTS ----------------------------------------------------

// GET all students
app.get('/students', async (req, res) =>{
    try{
        const resulet = await pool.query("SELECT * FROM student");
        res.json(resulet.rows);
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

// REGISTER students
app.post('/student_register', async (req, res) => {
    try{
        const { firstname, lastname, email, username, password } = req.body;

        if (!firstname || !lastname || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const student_checker = await pool.query("SELECT * FROM student WHERE username = $1 OR email = $2", [username, email]);
        if(student_checker.rows.length > 0){
            return res.status(400).json({message: "Student already exist"});
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query(
            "INSERT INTO student (firstname, lastname, email, username, password) VALUES ($1, $2, $3, $4, $5)",
            [firstname, lastname, email, username, hashedPassword]
        );

        res.status(201).json({ message: "Student registered successfully" });

    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

// LOGIN students
app.post('/student_auth', async (req, res) => {
    try{
        const { username, password } = req.body;
        if( !username || !password ){
            return res.status(400).json({message: "Invalid input"});
        }

        const student_checker = await pool.query("SELECT * FROM student WHERE  username = $1", [username]);
        if(student_checker.rows.length === 0){
            return res.status(400).json({message: "User does not exist"});
        }

        const newStudent = student_checker.rows[0];

        const match_password = await bcrypt.compare(password, newStudent.password);
        if(!match_password){
            return res.status(401).json({message: "Invalid input"});
        }

        const token = jwt.sign(
            { id: newStudent.id, username: newStudent.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({message: "Logged In", token});
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// GET studentws by username
app.get('/students_usernames', async (req, res) =>{
    try{
        const resulet = await pool.query("SELECT username FROM student");
        res.json(resulet.rows);
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

//---------------------- TEACHERS ----------------------------------------------------

// GET all teachers
app.get('/teachers', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM teacher");
        res.json(result.rows);
    
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

// REGISTER teachers
app.post('/register_teachers', async (req, res) => {
    try {
        const { firstname, lastname, email, phone, address, description, image, subject, price, availability, tutoring_location, username, password } = req.body;

        if (!firstname || !lastname || !email || !username || !password) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const userCheck = await pool.query("SELECT * FROM teacher WHERE username = $1 OR email = $2", [username, email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

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

// LOGIN teachers
app.post('/teacher_auth', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const userQuery = await pool.query("SELECT * FROM teacher WHERE username = $1", [username]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const user = userQuery.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect input" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// GET teachers by username
app.get('/teacher_usernames', async (req, res) => {
    try{
        const result = await pool.query("SELECT username FROM teacher");
        res.json(result.rows);
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

