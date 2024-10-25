import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardHeader from './dashboard-header';
import ShortSelect from '../../common/short-select';
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import view from "@/assets/dashboard/images/icon/icon_18.svg";
import ViewJobModal from '../../common/popup/view-job-modal';

type JobListing = {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  status: 'Not Applied' | 'Applied' | 'Selected' | 'Not Selected';
  employer: string;
};

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const JobAlertArea: React.FC<IProps> = ({ setIsOpenSidebar }) => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]); // Add state for applied jobs
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchJobListings();
      const appliedJobs = await fetchAppliedJobs();
      setAppliedJobs(appliedJobs);
    };

    fetchData();
  }, []);

  const fetchJobListings = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/joblistings/all");
      const jobListings = response.data;
      setJobListings(jobListings);
    } catch (error) {
      console.error('Error fetching job listings:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        throw new Error("User data not found in localStorage");
      }
      const userData = JSON.parse(userDataString);
      const token = userData.token;

      const response = await axios.get("http://localhost:5001/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)

      const appliedJobs = response.data.jobs;
      return appliedJobs;
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      return [];
    }
  };

  const handleViewJob = (job: JobListing) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const handleApplyJob = async (jobId: string) => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        alert("User data not found in localStorage");
        return;
      }
      const userData = JSON.parse(userDataString);
      const token = userData.token;
  
      const response = await axios.post(
        `http://localhost:5001/api/users/apply`,
        { jobId: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'  // Ensure content type is set
          },
        }
      );
  
      if (response.status === 200) {
        // Update applied jobs in state
        const appliedJobs = await fetchAppliedJobs();
        setAppliedJobs(appliedJobs);
        alert('Success: ' + response.data.message);
      } else {
        throw new Error('Application failed with status ' + response.status);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };
  

  const handleSaveJob = async (jobId: string) => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        throw new Error("User data not found in localStorage");
      }
      const userData = JSON.parse(userDataString);
      const token = userData.token;

      const response = await axios.post(
        `http://localhost:5001/api/joblistings/save`,
        { jobId: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Success', response.data.message); // Alert the success message from the backend
    } catch (error) {
      alert('Error', error.response?.data?.message || error.message); // Alert the error message from the backend
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Job Listings</h2>
        </div>
        <div className="bg-white card-box border-20">
          <div className="table-responsive">
            <table className="table job-alert-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Requirements</th>
                  <th scope="col">Employer</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {jobListings.map((jobListing) => {
                  const appliedJob = appliedJobs.find(job => job.job === jobListing._id);
                  const status = appliedJob ? appliedJob.status : 'Not Applied';

                  return (
                    <tr key={jobListing._id}>
                      <td>{jobListing.title}</td>
                      <td>{jobListing.description}</td>
                      <td>{jobListing.requirements}</td>
                      <td>{jobListing.employer}</td>
                      <td>{status}</td>
                      <td>
                        <div className="action-dots float-end">
                          <button
                            className="action-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span></span>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#" onClick={() => handleViewJob(jobListing)}>
                                <Image src={view} alt="icon" className="lazy-img" /> View
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#" onClick={() => handleApplyJob(jobListing._id)}>
                                <Image src={view} alt="icon" className="lazy-img" /> Apply
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#" onClick={() => handleSaveJob(jobListing._id)}>
                                <Image src={view} alt="icon" className="lazy-img" /> Save
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ViewJobModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        job={selectedJob}
      />
    </div>
  );
}

export default JobAlertArea;