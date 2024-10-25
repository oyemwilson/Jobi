// models/messageModel.js

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  targetRoles: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  readBy: { type: [mongoose.Schema.Types.ObjectId], default: [] } // Initialize readBy as an empty array
});

export default mongoose.model('Message', messageSchema);
