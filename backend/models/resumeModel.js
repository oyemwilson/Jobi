// models/File.js
import mongoose from 'mongoose';

const ResumeSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;
