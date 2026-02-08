const express = require("express");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const enrollRoutes = require("./routes/enroll.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, "..", "..", "frontend");
const pagesPath = path.join(frontendPath, "pages");

app.use(express.static(frontendPath));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(pagesPath, "index.html"));
});

app.get("/:page", (req, res, next) => {
  if (req.params.page.startsWith("api")) return next();

  const map = {
    login: "login.html",
    register: "register.html",
    courses: "courses.html",
    course: "course.html",
    profile: "profile.html",
    "my-courses": "my-courses.html",
    admin: "admin.html",
  };

  const file = map[req.params.page];
  if (!file) return next();

  res.sendFile(path.join(pagesPath, file));
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(pagesPath, "index.html"));
});

app.use(errorMiddleware);

module.exports = app;
