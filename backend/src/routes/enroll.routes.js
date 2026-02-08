const router = require("express").Router();
const enrollController = require("../controllers/enroll.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/my", authMiddleware, enrollController.myEnrollments);
router.get("/is-enrolled/:courseId", authMiddleware, enrollController.isEnrolled);

router.post("/:courseId", authMiddleware, enrollController.enroll);

module.exports = router;
