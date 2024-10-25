import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Define the user schema with separate firstName and lastName fields
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  role: {
    type: String,
    enum: ['applicant', 'employer', 'admin'],
    default: 'applicant',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  cvPath: String,
  coverLetterPath: String,
  // fileId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Resume'
  // },
  appliedJobs: [
    {
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobListing',
      },
      status: {
        type: String,
        enum: ['Not Applied', 'Applied', 'Selected', 'Not Selected'],
        default: 'Not Applied',
      },
      viewed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  companyName: { type: String }, // Add companyName field
  category: { type: String }, // Add category field
  aboutCompany: { type: String }, // Add aboutCompany field
  address: {
    country: { type: String }, // Add country field
    city: { type: String } // Add city field
  },
  qualifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Qualification'
  }],
  savedJobListings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'JobListing' 
  }]
}, {
  timestamps: true
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  // Check if the password field is modified
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt for hashing
  const salt = await bcrypt.genSalt(10);
  // Hash the password using the salt
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
