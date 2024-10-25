import express from 'express';
import { createJobListing, editJobListing, getJobListing, getAllJobListings, getUserJobListings, saveJob, getSavedJobs,deleteJobListing, deleteSavedJob, getJobListingById, getApplicantsForJob } from '../controllers/jobListingController.js';
import { protect, admin } from "../middleware/authmiddleware.js";
import {
  authUser,

} from "../controllers/userController.js";


const router = express.Router();

// API Endpoint for Posting Job Listings
router.route('/').post(protect, createJobListing);
router.route('/all').get(getAllJobListings);
router.route('/user').get(protect, getUserJobListings);
router.route('/save').post(protect, saveJob);
router.route('/user/savedjobs').get(protect, getSavedJobs);
router.route('/savedjobs/:jobId').delete(protect, deleteSavedJob);
router.route('/:id')
  .put(editJobListing)
  .delete(protect, deleteJobListing)
  .get(getJobListingById);
router.route('/applicants/:id').get(protect, getApplicantsForJob);




export default router;
