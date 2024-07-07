const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['admin']), adminController.getAllAdmins);
router.get('/:id', authenticateToken, authorizeRole(['admin']), adminController.getAdminById);
router.post('/', authenticateToken, authorizeRole(['admin']), adminController.addAdmin);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'user']), adminController.updateAdmin);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), adminController.deleteAdmin);


module.exports = router;
