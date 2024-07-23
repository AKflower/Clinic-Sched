const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.get('/doctor/:doctorId', reviewController.getReviewsByDoctor);
router.get('/department/:departmentId', reviewController.getReviewsByDepartment);
router.get('/appointment/:appointmentId', reviewController.getReviewByAppointment);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.get('/top-rated-doctors', reviewController.getTopRatedDoctors);


module.exports = router;
