const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/', roomController.createRoom);
router.get('/:roomId', roomController.getRoomById);
router.put('/:roomId', roomController.updateRoom);
router.delete('/:roomId', roomController.deleteRoom);

module.exports = router;
