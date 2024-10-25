import express from 'express';
import { sendMessage, getMessages, markAsRead,getLatestMessages } from '../controllers/messageController.js';
import { protect, admin } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post('/send',protect, admin, sendMessage);
router.get('/',protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.get('/latest', protect, getLatestMessages);

export default router;