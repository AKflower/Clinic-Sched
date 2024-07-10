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
router.post('/:id/dayOff', authenticateToken, authorizeRole(['admin','doctor']), doctorController.updateDayOff);
router.get('/:date/working', authenticateToken, authorizeRole(['admin','doctor']), doctorController.getWorkingDoctor);
router.put('/forgot/:id', authenticateToken, authorizeRole(['user']), doctorController.updateForgot);
router.put('/reset/:id', authenticateToken, authorizeRole(['admin']), doctorController.resetPassword);
router.put('/changePass/:id', authenticateToken, authorizeRole(['admin']), doctorController.updatePassword);
router.get('/wdbm/:id', authenticateToken, authorizeRole(['admin','doctor']), doctorController.getWorkingDaysByMonth);


module.exports = router;
