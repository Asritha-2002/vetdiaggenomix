const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const {auth} = require("../middleware/auth");
const { reviewSchemas } = require("../validation/schemas"); // adjust path

// CREATE REVIEW
router.post("/reviews", auth, async (req, res) => {
  try {
    // ✅ Joi validation
    const { error } = reviewSchemas.create.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { appointmentId, rating, review } = req.body;

    // ✅ check appointment exists
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // ✅ check ownership (security)
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // ✅ allow only completed or cancelled
    if (
      appointment.status !== "completed" &&
      appointment.status !== "cancelled"
    ) {
      return res.status(400).json({
        message: "You can review only completed/cancelled appointments",
      });
    }

    // ✅ prevent duplicate review
    const existingReview = await Review.findOne({
      userId: req.user.id,
      appointmentId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this appointment",
      });
    }

    // ✅ create review
    const newReview = new Review({
      userId: req.user.id,
      appointmentId,
      rating,
      review,
    });

    await newReview.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/reviews/my", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name")
      .lean();

    const toPascalCase = (str) => {
      if (!str) return "Anonymous";

      return str
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formatted = reviews.map((r) => ({
      id: r._id,
      review: r.review,
      rating: r.rating,
      userName: toPascalCase(r.userId?.name),
    }));

    //console.log(formatted);

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;