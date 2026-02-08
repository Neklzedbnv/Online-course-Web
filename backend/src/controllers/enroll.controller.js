const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.enroll = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    const course = await Course.findOne({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const exists = await Enrollment.findOne({ user: req.user._id, course: course._id });
    if (exists) return res.status(409).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: course._id
    });

    res.status(201).json({ message: "Enrolled", enrollmentId: enrollment._id });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.myEnrollments = async (req, res) => {
  try {
    const items = await Enrollment.find({ user: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 });

    const courses = items.map(x => x.course).filter(Boolean);
    res.json({ courses });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.isEnrolled = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    const course = await Course.findOne({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const exists = await Enrollment.findOne({ user: req.user._id, course: course._id });
    res.json({ enrolled: !!exists });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
