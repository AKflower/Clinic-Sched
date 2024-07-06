const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['admin']), appointmentController.getAllAppointments);
router.get('/:id', authenticateToken, authorizeRole(['admin']), appointmentController.getAppointmentById);
router.post('/', authenticateToken, authorizeRole(['user']), appointmentController.addAppointment);
router.put('/:id', authenticateToken, authorizeRole(['user', 'doctor']), appointmentController.updateAppointment);
router.delete('/:id', authenticateToken, authorizeRole(['user', 'doctor']), appointmentController.deleteAppointment);

module.exports = router;
