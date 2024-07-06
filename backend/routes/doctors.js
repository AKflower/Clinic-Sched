const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, doctorController.getAllDoctors);
router.post('/', authenticateToken, authorizeRole(['admin']), doctorController.addDoctor);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'doctor']), doctorController.updateDoctor);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), doctorController.deleteDoctor);

module.exports = router;
