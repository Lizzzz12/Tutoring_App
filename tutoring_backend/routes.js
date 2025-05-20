import express from 'express';

import studentController from './controllers/studentController.js';
import teacherController from './controllers/tutorController.js';
import announcementsController from './controllers/announcementsController.js';
import reviewController from './controllers/reviewController.js';
import announcementReviewController from './controllers/announcementReviewController.js';

import tutorMiddleware from './middleware/tutorMiddleware.js';
import studMiddleware from './middleware/studMiddleware.js';

import tutorMiddleware  from './middleware/tutorMiddleware.js';
import studMiddleware from './middleware/studMiddleware.js';

import announcementReviewController from './controllers/announcementReviewController.js';

import contactController from './controllers/contactController.js';

import adminController from './controllers/adminController.js';

const router = express.Router();

// ADMIN
router.post('/admin/login', adminController.login);
router.get('/admin/teachers', adminController.getPendingTeachers);
router.post('/admin/teachers/:id/approve', adminController.approveTeacher);
router.post('/admin/teachers/:id/reject', adminController.rejectTeacher);

// STUDENTS
router.get('/students', studentController.getAll);
router.post('/student_register', async (req, res) => {
  try {
    await studentController.register(req, res);
  } catch (err) {
    return res.status(500).json({ message: req.t('error.register_failed') });
  }
});
router.post('/student_auth', studentController.login);
router.get('/students_usernames', studentController.getUsernames);
router.get("/students/:id", studentController.getStudentById);
<<<<<<< HEAD
=======
router.post('/student_cred_change/:id', studMiddleware, studentController.changeCredentials);
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756

// TUTORS
router.get('/teachers', teacherController.getAll);
router.post('/register_teachers', teacherController.register);
router.post('/teacher_auth', teacherController.login);
router.get('/teacher_usernames', teacherController.getUsernames);
<<<<<<< HEAD
router.post('/teacher_update/:id', tutorMiddleware, teacherController.update);
router.get('/teachers/:id', teacherController.getTeacherById);
router.get('/teachers/:id/overallRating', teacherController.getTeacherOverallRating);
=======
router.post('/teacher_update/:id',tutorMiddleware, teacherController.update);
router.get('/teachers/:id', teacherController.getTeacherById);
router.get('/teachers/:id/overallRating', teacherController.getTeacherOverallRating);
router.post('/tutor_cred_change/:id', tutorMiddleware, teacherController.changeCredentials);

>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756

// ANNOUNCEMENTS
router.get('/announcements', announcementsController.getAll);
router.get('/teacher/:teacherId', announcementsController.getByTeacher);
router.post('/create_announcements', tutorMiddleware, announcementsController.create);
router.put('/update_announcements/:id', tutorMiddleware, announcementsController.update);
router.delete('/delete_announcements/:id', tutorMiddleware, announcementsController.delete);
<<<<<<< HEAD

// REVIEWS
router.post('/reviews', studMiddleware, reviewController.createReview);
router.get('/reviews/:teacherId', reviewController.getReviewsByTeacher);
router.delete('/reviews/:id', studMiddleware, reviewController.deleteReview);
=======
router.get("/announcements/:id", announcementsController.getById);


// REVIEWS
router.post('/reviews',studMiddleware, reviewController.createReview);
router.get('/reviews/:teacherId', reviewController.getReviewsByTeacher);
router.delete('/reviews/:id',studMiddleware, reviewController.deleteReview);
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756

// ANNOUNCEMENT REVIEWS
router.get('/announcementReviews/:id', announcementReviewController.getReviewsByAnnouncement);
router.post('/announcementReviews', announcementReviewController.createReview);
<<<<<<< HEAD
=======

// Contact
router.post('/contact', contactController.create);
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756

export default router;
