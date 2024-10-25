import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';  // Add this import at the top of your file
import { promises as fsPromises } from 'fs';  // Rename the existing import
import User from "../models/userModel.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { protect } from '../middleware/authmiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Check and create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
try {
  await fsPromises.access(uploadsDir);
  console.log('Uploads directory exists');
} catch (error) {
  console.log('Uploads directory does not exist, creating it...');
  await fsPromises.mkdir(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Route for uploading CV and cover letter
router.post('/upload', protect, upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'coverLetter', maxCount: 1 }]), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Files received:', req.files);

    if (req.files.cv) {
      user.cvPath = req.files.cv[0].path;
      console.log('CV file details:', req.files.cv[0]);
      console.log('CV saved at:', user.cvPath);

      // Verify file exists immediately after upload
      try {
        await fsPromises.access(user.cvPath);
        console.log('CV file exists after upload');
      } catch (error) {
        console.error('CV file does not exist after upload:', error);
      }
    }

    if (req.files.coverLetter) {
      user.coverLetterPath = req.files.coverLetter[0].path;
      console.log('Cover Letter saved at:', user.coverLetterPath);
    }

    await user.save();

    res.json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// Route for viewing uploaded files
// Route for viewing uploaded files
router.get('/view/:fileType/:userId?', protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requestedUserId = req.params.userId || currentUserId;
    const fileType = req.params.fileType;
    
    // Check if the current user is an employer or if they're requesting their own file
    if (requestedUserId !== currentUserId && req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized to view this file' });
    }

    const user = await User.findById(requestedUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let filePath;
    if (fileType === 'cv') {
      filePath = user.cvPath;
    } else if (fileType === 'coverLetter') {
      filePath = user.coverLetterPath;
    } else {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    if (!filePath) {
      return res.status(400).json({ message: 'File path is undefined or invalid' });
    }

    console.log('Attempting to access file:', filePath);

    // Check if the file exists
    try {
      await fsPromises.access(filePath, fs.constants.R_OK);
      console.log('File exists and is readable');
    } catch (error) {
      console.error('File does not exist or is not readable:', error);
      return res.status(404).json({ message: 'File not found or not accessible' });
    }

    // Serve the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(err.status || 500).json({ message: 'Error sending file', error: err.message });
      }
    });

  } catch (error) {
    console.error('Error in /view route:', error);
    res.status(500).json({ message: 'Error viewing file', error: error.message });
  }
});


// In your uploadRoutes.js or similar file

router.delete('/delete/:fileType', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileType = req.params.fileType;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let filePath;
    if (fileType === 'cv') {
      filePath = user.cvPath;
      user.cvPath = undefined;
    } else if (fileType === 'coverLetter') {
      filePath = user.coverLetterPath;
      user.coverLetterPath = undefined;
    } else {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    if (filePath) {
      // Delete the file from the filesystem
      await fsPromises.unlink(filePath);
    }

    // Save the updated user document
    await user.save();

    res.json({ message: `${fileType} deleted successfully` });
  } catch (error) {
    console.error('Error in delete route:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});


export default router;
