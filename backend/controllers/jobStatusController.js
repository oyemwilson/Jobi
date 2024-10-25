import JobListing from "../models/jobListingModel.js";
import User from "../models/userModel.js";

export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, viewed } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const jobListing = await JobListing.findById(jobId);

    if (!jobListing) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userRole === 'applicant') {
      const appliedJobIndex = user.appliedJobs?.findIndex((job) => job.job?.toString() === jobId);

      if (appliedJobIndex !== -1) {
        user.appliedJobs[appliedJobIndex].status = status;
        user.appliedJobs[appliedJobIndex].viewed = viewed;
      } else {
        user.appliedJobs.push({
          job: jobId,
          status,
          viewed,
        });
      }
    } else if (userRole === 'employer') {
      const applicantIndex = jobListing.applicants?.findIndex((applicantId) => applicantId.toString() === userId);

      if (applicantIndex !== -1) {
        const applicant = await User.findById(jobListing.applicants[applicantIndex]);

        if (applicant) {
          const appliedJobIndex = applicant.appliedJobs?.findIndex((job) => job.job?.toString() === jobId);

          if (appliedJobIndex !== -1) {
            applicant.appliedJobs[appliedJobIndex].status = status;
            applicant.appliedJobs[appliedJobIndex].viewed = viewed;
            await applicant.save();
          }
        }
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await user.save();
    await jobListing.save();

    res.status(200).json({ message: 'Job status updated successfully' });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ error: 'An error occurred while updating job status' });
  }
};