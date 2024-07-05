const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', doctorController.getAllDoctors);
router.post('/', authenticateToken, authorizeRole(['admin']), doctorController.createDoctor);

module.exports = router;
