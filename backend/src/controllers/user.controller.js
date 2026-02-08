const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

exports.getUser = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (email) req.user.email = email.toLowerCase();
    if (password) req.user.password = password;

    await req.user.save();

    res.json({
      message: "Updated",
      user: { id: req.user._id, email: req.user.email, role: req.user.role }
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
exports.myCourses = async (req, res) => {
  const user = await req.user.populate("courses");
  res.json({ courses: user.courses });
};


exports.getUsersWithEnrollments = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id email role createdAt")
      .sort({ createdAt: -1 });

    const userIds = users.map(u => u._id);

    const enrollments = await Enrollment.find({ user: { $in: userIds } })
      .populate("course")
      .sort({ createdAt: -1 });

    const map = new Map();
    for (const u of users) map.set(String(u._id), []);

    for (const e of enrollments) {
      const k = String(e.user);
      if (!map.has(k)) map.set(k, []);
      if (e.course) {
        map.get(k).push({
          courseId: e.course.courseId,
          title: e.course.title,
          status: e.status,
          enrolledAt: e.createdAt
        });
      }
    }

    res.json({
      users: users.map(u => ({
        id: u._id,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        courses: map.get(String(u._id)) || []
      }))
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

