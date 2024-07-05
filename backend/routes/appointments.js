const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['admin']), appointmentController.getAllAppointments);
router.post('/', authenticateToken, authorizeRole(['user']), appointmentController.createAppointment);

module.exports = router;
