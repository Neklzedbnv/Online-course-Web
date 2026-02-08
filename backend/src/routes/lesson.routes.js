const router = require("express").Router();

const lessonController = require("../controllers/lesson.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/access.middleware");
const validate = require("../middleware/validate.middleware");
const { createLessonSchema, updateLessonSchema } = require("../validators/lesson.validator");

router.get("/by-course/:courseId", lessonController.getLessonsByCourse);
router.get("/:id", lessonController.getLessonById);

router.post("/", authMiddleware, allowRoles("admin"), validate(createLessonSchema), lessonController.createLesson);
router.put("/:id", authMiddleware, allowRoles("admin"), validate(updateLessonSchema), lessonController.updateLesson);
router.delete("/:id", authMiddleware, allowRoles("admin"), lessonController.deleteLesson);

module.exports = router;
