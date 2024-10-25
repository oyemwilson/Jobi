import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import OTP from "../models/otpModel.js";
import JobListing from "../models/jobListingModel.js";

// @desc Auth user & get token
// @route Post /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
    jobs: user.appliedJobs,
    savedJobListings: user.savedJobListings,
    token: generateToken(user._id),
  });
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, otp, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (!otp) {
    res.status(400);
    throw new Error("OTP is required for registration");
  }

  const latestOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

  if (!latestOTP || otp !== latestOTP.otp) {
    return res.status(400).json({
      success: false,
      message: 'The OTP is not valid'
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      jobs: user.appliedJobs,
      phoneNumber: user.mobile,
      isAdmin: user.isAdmin,
      companyName: user.companyName,
      category: user.category,
      aboutCompany: user.aboutCompany,
      city: user.address.city,
      country: user.address.country,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Validate input
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old password and new password are required." });
  }

  try {
    const user = await User.findOne({ email});

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect." });
    }

    // Update password
    user.password = newPassword; 

    const b = await user.save();


    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



const validatePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user from the database using the email
    const user = await User.findOne({ email });

    // Check if user exists and compare passwords
    if (!user || !user.comparePassword(password)) {
      // If user not found or password doesn't match
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Password is valid
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


  // @desc  Update user profile including additional fields
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.mobile = req.body.phoneNumber || user.mobile; // Update mobile field with phoneNumber from request body
    
    // Update additional fields
    user.companyName = req.body.companyName || user.companyName;
    user.category = req.body.category || user.category;
    user.aboutCompany = req.body.aboutCompany || user.aboutCompany;
    user.address.country = req.body.country || user.address.country;
    user.address.city = req.body.city || user.address.city;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      mobile: updatedUser.mobile, // Return mobile field
      companyName: updatedUser.companyName, // Return companyName field
      category: updatedUser.category, // Return category field
      aboutCompany: updatedUser.aboutCompany, // Return aboutCompany field
      address: {
        country: updatedUser.address.country, // Return country field
        city: updatedUser.address.city // Return city field
      },
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});



  
// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, isAdmin, verified } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.isAdmin = isAdmin;
      user.verified = verified

      const updatedUser = await user.save();

      res.json({
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          verified: updatedUser.verified
      });
  } else {
      res.status(404);
      throw new Error('User not found');
  }
});



// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    console.log('User:', user); // Check the value of user
  
    if (user) {
       console.log('User found. Removing...'); // Debugging statement
      await user.deleteOne(); // or user.deleteMany() if needed
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });
  const applyForJob = asyncHandler(async (req, res) => {
    try {
        const jobId = req.body.jobId; // Get the job ID from the request body
        const userId = req.user._id; // Get the user ID from the authenticated user

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the job by ID
        const job = await JobListing.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if the user has already applied for the job
        const alreadyApplied = user.appliedJobs.some(job => job.job.toString() === jobId.toString());

        if (alreadyApplied) {
            return res.status(400).json({ error: 'User has already applied for this job' });
        }

        // Add the job to the user's appliedJobs array with status "applied"
        user.appliedJobs.push({
            job: jobId,
            status: 'Applied', // Set status to "applied"
            viewed: false // Optional: set default value for 'viewed' status
        });
        await user.save();

        // Add the user to the job's applicants array
        job.applicants.push(userId);
        await job.save();

        res.status(200).json({ message: 'Job application submitted successfully' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ error: 'An error occurred while applying for the job' });
    }
});
export { authUser, getUserProfile, registerUser, getUsers, updateUser, deleteUser, updateUserProfile, validatePassword, changePassword, applyForJob };
