const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

exports.getLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findOne({ courseId: Number(courseId) });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lessons = await Lesson.find({ course: course._id }).sort({ createdAt: 1 });
    res.json({ lessons });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json({ lesson });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { course, title, content, duration, videoUrl } = req.body;

    const existsCourse = await Course.findById(course);
    if (!existsCourse) return res.status(404).json({ message: "Course not found" });

    const lesson = await Lesson.create({
      course,
      title,
      content,
      duration,
      videoUrl: videoUrl || ""
    });

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { course, title, content, duration, videoUrl } = req.body;

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (course) {
      const existsCourse = await Course.findById(course);
      if (!existsCourse) return res.status(404).json({ message: "Course not found" });
      lesson.course = course;
    }

    if (title !== undefined) lesson.title = title;
    if (content !== undefined) lesson.content = content;
    if (duration !== undefined) lesson.duration = duration;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;

    await lesson.save();

    res.json({ message: "Lesson updated", lesson });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json({ message: "Lesson deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
