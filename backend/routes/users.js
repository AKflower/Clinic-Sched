const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['admin','user']), userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRole(['admin','user','doctor']), userController.getUserById);
router.post('/', authenticateToken, authorizeRole(['admin']), userController.addUser);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'user']), userController.updateUser);
router.put('/active/:id', authenticateToken, authorizeRole(['admin']), userController.updateActiveUser);
router.put('/forgot/:id', authenticateToken, authorizeRole(['user']), userController.updateForgot);
router.put('/reset/:id', authenticateToken, authorizeRole(['admin']), userController.resetPassword);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);


module.exports = router;
