const router = require("express").Router();

const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { allowRoles } = require("../middleware/access.middleware");
const { createCourseSchema, updateCourseSchema } = require("../validators/course.validator");

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

router.post("/", authMiddleware, allowRoles("admin"), validate(createCourseSchema), courseController.createCourse);
router.put("/:id", authMiddleware, allowRoles("admin"), validate(updateCourseSchema), courseController.updateCourse);
router.delete("/:id", authMiddleware, allowRoles("admin"), courseController.deleteCourse);

module.exports = router;
