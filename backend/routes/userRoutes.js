import express from "express";
// import {
//   authUser,
//   getUserProfile,
//   registerUser,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authmiddleware.js";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUser,
  deleteUser,
  getUsers,
  updateUserProfile,
  changePassword,
  applyForJob
} from "../controllers/userController.js";

const router = express.Router();
router.use(express.json());

// router.route("/").post(registerUser).get(protect, admin, getUsers);
// router
//   .route("/login")
//   .get(authUser) // Handle GET requests
//   .post(authUser); // Handle POST requests
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post('/apply',protect, applyForJob);
router.post("/login", authUser)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only routes for managing users
router
  .route("/:id")
  .get(protect, admin, getUserProfile)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
  // .post(protect, changePassword)

//

// routes/userRoutes.js

// Route to change password
router.post("/change-password", protect, changePassword);

router.get('/my-files', protect, async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



export default router;
