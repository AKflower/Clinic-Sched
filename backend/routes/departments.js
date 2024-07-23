const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Thêm, sửa, xóa Department
router.put('/:id/active', departmentController.updateDepartmentIsActive);

router.post('/', authenticateToken, authorizeRole(['admin']), departmentController.addDepartment);
router.get('/:id', authenticateToken, authorizeRole(['admin', 'doctor', 'user']), departmentController.getDepartmentById);
router.put('/:id', authenticateToken, authorizeRole(['admin']), departmentController.updateDepartment);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), departmentController.deleteDepartment);
router.get('/', authenticateToken, authorizeRole(['admin', 'doctor', 'user']), departmentController.getAllDepartments);


module.exports = router;
