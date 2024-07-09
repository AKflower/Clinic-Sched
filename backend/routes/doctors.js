const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/department/:departmentId/availability', authenticateToken, authorizeRole(['admin', 'user']), doctorController.getDoctorsWithAvailability);

router.get('/', authenticateToken, doctorController.getAllDoctors);
router.get('/:id', authenticateToken, doctorController.getDoctorById);
router.post('/', authenticateToken, authorizeRole(['admin']), doctorController.addDoctor);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'doctor']), doctorController.updateDoctor);
router.put('/active/:id', authenticateToken, authorizeRole(['admin']), doctorController.updateActiveDoctor);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), doctorController.deleteDoctor);
router.post('/:doctorId/dayOff', authenticateToken, authorizeRole(['admin','doctor']), doctorController.updateDayOff);

module.exports = router;
