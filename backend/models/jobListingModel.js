import mongoose from "mongoose";

const jobListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  employer: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Applied', 'Applied','Active', 'Selected', 'Not Selected','Pending'],
    default: 'Active'
  },
  viewed: {
    type: Boolean,
    default: false
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  responsibilities: [{
    type: [String],
    required: true
  }],
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD' // Default currency, change as per your needs
    }
  },
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const JobListing = mongoose.model('JobListing', jobListingSchema);

export default JobListing;
