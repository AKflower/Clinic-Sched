const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['admin']), appointmentController.getAllAppointments);
router.get('/:id', authenticateToken, authorizeRole(['admin']), appointmentController.getAppointmentById);
router.post('/', authenticateToken, authorizeRole(['user']), appointmentController.addAppointment);
router.put('/:id', authenticateToken, authorizeRole(['user', 'doctor']), appointmentController.updateAppointment);
router.delete('/:id', authenticateToken, authorizeRole(['user', 'doctor']), appointmentController.deleteAppointment);
router.get('/doctor/:doctorId/times', authenticateToken, appointmentController.getDoctorAppointmentsTimeByDate);
router.get('/doctor/:doctorId', authenticateToken, appointmentController.getDoctorAppointmentsTimeByDate);
router.get('/user/:userId', authenticateToken, appointmentController.getUserAppointmentsByDate);

module.exports = router;
