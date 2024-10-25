import React, { useState, useEffect } from "react";
import Image from "next/image";
import DashboardHeader from "./dashboard-header";
import axios from "axios";
import ViewJobModal from '../../common/popup/view-job-modal';
import view from "@/assets/dashboard/images/icon/icon_18.svg";

type JobListing = {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  employer: string;
  status: 'Not Applied' | 'Applied' | 'Selected' | 'Not Selected';
};

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SavedJobArea = ({ setIsOpenSidebar }: IProps) => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSavedJobs();
      const appliedJobs = await fetchAppliedJobs();
      setAppliedJobs(appliedJobs);
    };

    fetchData();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData.token;

      const response = await axios.get("http://localhost:5001/api/joblistings/user/savedjobs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSavedJobs(response.data.savedJobs);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
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
        throw new Error("User data not found in localStorage");
      }
      const userData = JSON.parse(userDataString);
      const token = userData.token;

      // Update the job status in the database
      const updateStatusResponse = await axios.put(
        `http://localhost:5001/api/jobstatus/${jobId}/status`,
        { status: 'Applied', viewed: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refetch the applied jobs
      const appliedJobs = await fetchAppliedJobs();
      setAppliedJobs(appliedJobs);

      // Update the status in the local state
      setSavedJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, status: 'Applied' } : job
        )
      );

      // Alert the success message from the backend
      alert('Success: ' + updateStatusResponse.data.message);
    } catch (error) {
      // Alert the error message from the backend
      alert('Error: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDeleteSavedJob = async (jobId: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData.token;

      // Send a DELETE request to remove the saved job
      const response = await axios.delete(
        `http://localhost:5001/api/joblistings/savedjobs/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Alert the success message from the backend
      alert('Success: ' + response.data.message);

      // Update the savedJobs state to remove the deleted job
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      // Alert the error message from the backend
      alert('Error: ' + error.response.data.error);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Saved Jobs</h2>
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
                {savedJobs.map((job) => {
                  const appliedJob = appliedJobs.find(appliedJob => appliedJob.job === job._id);
                  const status = appliedJob ? appliedJob.status : 'Not Applied';

                  return (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.description}</td>
                      <td>{job.requirements}</td>
                      <td>{job.employer}</td>
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
                              <a className="dropdown-item" href="#" onClick={() => handleViewJob(job)}>
                                <Image src={view} alt="icon" className="lazy-img" /> View
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#" onClick={() => handleApplyJob(job._id)}>
                                <Image src={view} alt="icon" className="lazy-img" /> Apply
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#" onClick={() => handleDeleteSavedJob(job._id)}>
                                <Image src={view} alt="icon" className="lazy-img" /> Delete
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
};

export default SavedJobArea;