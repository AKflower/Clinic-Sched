const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Thêm, sửa, xóa File
router.post('/', authenticateToken, authorizeRole(['admin','user','doctor']), fileController.addFile);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'doctor']), fileController.updateFile);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'doctor']), fileController.deleteFile);
router.get('/', authenticateToken, fileController.getAllFiles);
router.get('/user/:userId', authenticateToken, fileController.getFilesByUserId);

module.exports = router;
