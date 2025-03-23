import express from 'express';
import studentController from './controllers/studentController.js';
import teacherController from './controllers/tutorController.js';

const router = express.Router();

// STUDENTS
router.get('/students', studentController.getAll);
router.post('/student_register', studentController.register);
router.post('/student_auth', studentController.login);
router.get('/students_usernames', studentController.getUsernames);

// TUTORS
router.get('/teachers', teacherController.getAll);
router.post('/register_teachers', teacherController.register);
router.post('/teacher_auth', teacherController.login);
router.get('/teacher_usernames', teacherController.getUsernames);

export default router;
