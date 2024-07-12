const Appointment = require('../models/Appointment');
const Room = require('../models/room');

exports.createRoom = async (req, res) => {
  const { userId, doctorId, appointmentId, startDateTime, endDateTime } = req.body;

  try {
    const newRoom = new Room({
      userId,
      doctorId,
      appointmentId,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime)
    });

    const savedRoom = await newRoom.save();

     // Cập nhật mảng appointments của user
     await Appointment.findByIdAndUpdate(appointmentId, {
      $push: { roomId: savedRoom._id }
    });
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getRoomById = async (req, res) => {
  console.log('GeTRoomById',req.params);
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateRoom = async (req, res) => {
  const { startDateTime, endDateTime } = req.body;

  try {
    const room = await Room.findByIdAndUpdate(
        req.params.id,
      { startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime) },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteRoom = async (req, res) => {

  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    res.status(200).json({ message: 'Room deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
