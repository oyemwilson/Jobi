import express from "express";
import { validatePassword } from "../controllers/userController.js";

const router = express.Router();

router.post('/', validatePassword);

export default router;
