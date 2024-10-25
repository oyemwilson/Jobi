const Job = require('../models/job');
const Applicant = require('../models/applicant');

exports.getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID and populate the applicants field
    const job = await Job.findById(jobId).populate('applicants');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ applicants: job.applicants });
  } catch (error) {
    console.error('Error retrieving applicants:', error);
    res.status(500).json({ error: 'An error occurred while retrieving applicants' });
  }
}