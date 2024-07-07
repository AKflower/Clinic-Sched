const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Route để thêm timeSlot mới
router.post('/', authenticateToken, authorizeRole(['admin']), timeSlotController.createTimeSlot);

// Route để lấy tất cả timeSlots
router.get('/', authenticateToken, timeSlotController.getAllTimeSlots);

module.exports = router;
