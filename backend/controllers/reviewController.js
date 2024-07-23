const Review = require('../models/review');

const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getReviewsByDoctor = async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReviewsByDepartment = async (req, res) => {
  try {
    const reviews = await Review.find({ departmentId: req.params.departmentId });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getReviewByAppointment = async (req, res) => {
  try {
    const reviews = await Review.find({ appointmentId: req.params.appointmentId });
    res.status(200).send(reviews[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) {
      return res.status(404).send();
    }
    res.send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).send();
    }
    res.send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTopRatedDoctors = async (req, res) => {
  try {
    const topRatedDoctors = await Review.aggregate([
      {
        $group: {
          _id: "$doctorId",
          averageRating: { $avg: "$rating" }
        }
      },
      {
        $sort: { averageRating: -1 }
      },
      {
        $limit: 3
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor"
        }
      },
      {
        $unwind: "$doctor"
      },
      {
        $project: {
          _id: 0,
          doctorId: "$_id",
          averageRating: 1,
          doctorName: "$doctor.name",
          gender: "$doctor.gender",
          doctorSpecialty: "$doctor.specialty"
        }
      }
    ]);
    res.status(200).json(topRatedDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByDoctor,
  getReviewsByDepartment,
  updateReview,
  deleteReview,
  getReviewByAppointment,
  getTopRatedDoctors
};
