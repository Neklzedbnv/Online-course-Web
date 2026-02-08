const Course = require("../models/Course");

exports.getAllCourses = async (req, res, next) => {

  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (e) {
    next(e);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    const course = await Course.findOne({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (e) {
    next(e);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const exists = await Course.findOne({ courseId: req.body.courseId });
    if (exists) return res.status(409).json({ message: "courseId already exists" });

    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);

    if (req.body.courseId !== undefined && Number(req.body.courseId) !== courseId) {
      return res.status(400).json({ message: "courseId cannot be changed" });
    }

    const course = await Course.findOneAndUpdate({ courseId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (e) {
    next(e);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    const course = await Course.findOneAndDelete({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (e) {
    next(e);
  }
};

