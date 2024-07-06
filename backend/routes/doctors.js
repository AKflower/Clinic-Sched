const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, doctorController.getAllDoctors);
router.get('/:id', authenticateToken, doctorController.getDoctorById);
router.post('/', authenticateToken, authorizeRole(['admin']), doctorController.addDoctor);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'doctor']), doctorController.updateDoctor);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), doctorController.deleteDoctor);
router.get('/available/:departmentId', authenticateToken, doctorController.getAvailableDoctors);
router.get('/department/:departmentId', authenticateToken, authorizeRole(['admin', 'user']), doctorController.getDoctorsByDepartment);

module.exports = router;
