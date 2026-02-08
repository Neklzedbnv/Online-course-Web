const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { allowRoles } = require("../middleware/access.middleware");
const { updateProfileSchema } = require("../validators/user.validator");


router.get("/profile", authMiddleware, userController.getUser);

router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateUser
);
router.get("/my-courses", authMiddleware, userController.myCourses);

router.get("/admin/users", authMiddleware, allowRoles("admin"), userController.getUsersWithEnrollments);
module.exports = router;
