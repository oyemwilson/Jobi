import JobListing from '../models/jobListingModel.js';
import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";


// Middleware to extract employerId from authenticated user
// 


// Create a new job listing
export const createJobListing = asyncHandler(async (req, res) => {
    try {
      // Fetch current user details
      const user = await User.findById(req.user._id);
  
      // Destructure the request body to get job listing fields
      const {
        title,
        description,
        overview,
        category,
        type,
        salaryMin,
        salaryMax,
        experience,
        address,
        country,
        state,
        responsibilities,
      } = req.body;
  
      // Validate required fields
      if (
        !title ||
        !description ||
        !overview ||
        !category ||
        !type ||
        !experience ||
        !salaryMin ||
        !salaryMax ||
        !address ||
        !country ||
        !state ||
        !responsibilities
      ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Convert responsibilities string to array
      let responsibilitiesArray;

      if (typeof responsibilities === 'string') {
        responsibilitiesArray = responsibilities.split('\n').map((item) => item.trim());
      } else {
        responsibilitiesArray = responsibilities;
      }
  
      // Create new job listing instance
      const newJobListing = new JobListing({
        title,
        description,
        overview,
        category,
        type,
        experience,
        employer: `${user.firstName} ${user.lastName}`, // Combine first name and last name
        employerId: user._id,
        responsibilities: responsibilitiesArray,
        salary: {
          min: salaryMin,
          max: salaryMax,
          currency: 'USD', // Default currency, adjust if needed
        },
        address,
        country,
        state,
        status: 'Pending', // Default status
        viewed: false, // Default viewed status
        applicants: [], // Initialize with an empty array
      });
  
      // Save the job listing to the database
      await newJobListing.save();
  
      // Respond with the created job listing
      res.status(201).json(newJobListing);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
export const deleteJobListing = asyncHandler(async (req, res) => {
    const jobId = req.params.id; // Assuming jobId is passed as a route parameter
    const userId = req.user._id; // Assuming you're using authentication middleware to attach the user to the request

    try {
        // Check if the job listing exists
        const jobListing = await JobListing.findById(jobId);

        if (!jobListing) {
            return res.status(404).json({ error: 'Job listing not found' });
        }

        // Check if the authenticated user is the employer who posted the job or if the user is an admin
        if (jobListing.employerId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to delete this job listing' });
        }

        // Delete the job listing
        await JobListing.deleteOne({ _id: jobId });

        res.json({ success: true, message: 'Job listing deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


export const getUserJobListings = async (req, res) => {
    try {
        // Get employerId from the authenticated user
        const employerId = req.user.id;

        // Fetch job listings for this specific employer
        const allJobListings = await JobListing.find({ employerId });

        // Respond with the array of job listings
        res.json(allJobListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



export const getJobListing = async (req, res) => {
    try {
        // Extract job listing ID from request parameters
        const jobId = req.params.id;

        // Find the job listing by ID in the database
        const jobListing = await JobListing.findById(jobId);

        // Check if the job listing exists
        if (!jobListing) {
            return res.status(404).json({ error: 'Job listing not found' });
        }

        // Respond with the job listing data
        res.json(jobListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getJobListingById = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find the job listing by ID
        const jobListing = await JobListing.findById(jobId);

        if (!jobListing) {
            return res.status(404).json({ error: 'Job listing not found' });
        }

        res.json(jobListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const editJobListing = async (req, res) => {
    try {
        // Extract job listing ID from request parameters
        const jobId = req.params.id;

        // Check if the job listing exists
        const existingJobListing = await JobListing.findById(jobId);
        if (!existingJobListing) {
            return res.status(404).json({ error: 'Job listing not found' });
        }

        // Extract updated job listing data from request body
        const {title, description, overview, category, type, experience, address, country, state, responsibilities, requirements, salaryMin, salaryMax } = req.body;

        // Update the existing job listing using Object.assign()
        Object.assign(existingJobListing, {  title, description, overview, category, type, experience, address, country, state, responsibilities, requirements, salaryMin, salaryMax});

        // Save the updated job listing
        await existingJobListing.save();

        // Respond with the updated job listing
        res.json(existingJobListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const saveJob = async (req, res) => {
    try {
      const userId = req.user.id; // Get user ID from authenticated user
      const jobId = req.body.jobId; // Get job ID from request body
      // Save job listing ID to user's document in the database
      await User.findByIdAndUpdate(userId, { $addToSet: { savedJobListings: jobId } });
      res.status(200).json({ success: true, message: "Job listing saved successfully" });
    } catch (error) {
      console.error('Error saving job listing:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated user
        // Fetch the user document from the database
        const user = await User.findById(userId);
        
        // Check if user exists and has saved job listings
        if (!user || !user.savedJobListings) {
            return res.status(404).json({ success: false, message: "No saved job listings found for this user" });
        }

        // Retrieve details of each saved job listing
        const savedJobs = await Promise.all(user.savedJobListings.map(async jobId => {
            // Fetch job details based on jobId
            const jobDetails = await JobListing.findById(jobId);
            return jobDetails;
        }));

        // Return the array of job details
        res.status(200).json({ success: true, savedJobs: savedJobs });
    } catch (error) {
        console.error('Error fetching saved job listings:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const deleteSavedJob = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming you're using authentication middleware to attach the user to the request
    const jobId = req.params.jobId; // Assuming jobId is passed as a route parameter
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
  
      // Log the user object and savedJobListings array before deletion
  
      // Check if the provided job ID exists in the user's savedJobListings array
      if (!user.savedJobListings.includes(jobId)) {
        res.status(404);
        throw new Error('Job not found in user\'s saved job listings');
      }
  
      // Remove jobId from savedJobListings array
      user.savedJobListings.pull(jobId);
      await user.save();
  
      // Log the user object and savedJobListings array after deletion
      console.log('User after deletion:', user);
      console.log('Saved job listings after deletion:', user.savedJobListings);
  
      res.json({ success: true, message: 'Job listing removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

export const getAllJobListings = async (req, res) => {
    try {
        // Fetch all job listings from the database
        const allJobListings = await JobListing.find();

        // Respond with the array of job listings
        res.json(allJobListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getApplicantsForJob = asyncHandler (async(req, res) => {
    try {
      const  jobId  = req.params.id;
  
      // Find the job by ID and populate the applicants field
      const job = await JobListing.findById(jobId).populate('applicants');
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      // Log job information

      res.status(200).json({ applicants: job.applicants });
    } catch (error) {
      console.error('Error retrieving applicants:', error);
      res.status(500).json({ error: 'An error occurred while retrieving applicants' });
    }
});
