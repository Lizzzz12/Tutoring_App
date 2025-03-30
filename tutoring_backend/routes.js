import express from 'express';

import studentController from './controllers/studentController.js';
import teacherController from './controllers/tutorController.js';
import announcementsController from './controllers/announcementsController.js';
import reviewController from './controllers/reviewController.js';

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

// ANNOUCMENTS
router.get('/announcements', announcementsController.getAll);
router.get('/announcements/teacher/:teacherId', announcementsController.getByTeacher);
router.post('/create_announcements', announcementsController.create);
router.put('/update_announcements/:id', announcementsController.update);
router.delete('/delete_announcements/:id', announcementsController.delete);

// REVIEWS
router.post('/reviews', reviewController.createReview);
router.get('/reviews/:teacherId', reviewController.getReviewsByTeacher);
router.delete('/reviews/:id', reviewController.deleteReview);

export default router;
