import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../candidate/dashboard-header";
import ShortSelect from "../../common/short-select";
import Image from "next/image";
import view from "@/assets/dashboard/images/icon/icon_18.svg";
import edit from "@/assets/dashboard/images/icon/icon_20.svg";
import delete_icon from "@/assets/dashboard/images/icon/icon_21.svg";
import EditJobModal from "../../common/popup/edit-job-modal";
import ViewJobModal from "../../common/popup/view-job-modal";
import ApplicantsModal from "../../common/popup/applicant-modal";

interface JobListing {
  _id: string;
  title: string;
  applicants: string;
  createdAt: string;
  status: string;
}

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  jobListings: JobListing[]; // Pass job listings data as a pr
};

const JobAlertArea: React.FC<IProps> = ({ setIsOpenSidebar }) => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJobIdForApplicants, setSelectedJobIdForApplicants] =
    useState("");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  useEffect(() => {
    fetchJobListings();
  }, []);

  const handleViewApplicants = (jobId: string) => {
    setSelectedJobIdForApplicants(jobId);
    setShowApplicantsModal(true);
  };
  const handleEditJob = (job: JobListing) => {
    setSelectedJobId(job._id);
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = () => {
    fetchJobListings();
  };
  const handleViewJob = (job: JobListing) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const fetchJobListings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:5001/api/joblistings/user",
        config
      );
      setJobListings(response.data);
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:5001/api/joblistings/${jobId}`,
        config
      );

      // Remove the deleted job from the jobListings state
      setJobListings((prevJobListings) =>
        prevJobListings.filter((job) => job._id !== jobId)
      );

      console.log("Job deleted successfully");
      // Display a success message or update the UI accordingly
    } catch (error) {
      console.error("Error deleting job:", error);
      // Handle the error and display an error message
    }
  };
  console.log(jobListings);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Job Listings</h2>
          <div className="short-filter d-flex align-items-center">
            <div className="text-dark fw-500 me-2">Short by:</div>
            <ShortSelect />
          </div>
        </div>
        <div className="bg-white card-box border-20">
          <div className="table-responsive">
            <table className="table job-alert-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Job Created</th>
                  <th scope="col">Applicants</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {jobListings.map((jobListing) => (
                  <tr key={jobListing._id}>
                    <td>{jobListing.title}</td>
                    <td>
                      {new Date(jobListing.createdAt).toLocaleDateString()}
                    </td>
                    <td>{jobListing.applicants.length}</td>
                    <td>{jobListing.status}</td>

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
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => handleViewJob(jobListing)}
                            >
                              <Image
                                src={view}
                                alt="icon"
                                className="lazy-img"
                              />{" "}
                              View
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => handleEditJob(jobListing)}
                            >
                              <Image
                                src={edit}
                                alt="icon"
                                className="lazy-img"
                              />{" "}
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => handleDeleteJob(jobListing._id)}
                            >
                              <Image
                                src={delete_icon}
                                alt="icon"
                                className="lazy-img"
                              />{" "}
                              Delete
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() =>
                                handleViewApplicants(jobListing._id)
                              }
                            >
                              <Image
                                src={view}
                                alt="icon"
                                className="lazy-img"
                              />{" "}
                              Applicants
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
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

      <ApplicantsModal
        show={showApplicantsModal}
        onHide={() => setShowApplicantsModal(false)}
        jobId={selectedJobIdForApplicants}
      />

      <EditJobModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        jobId={selectedJobId}
        job={selectedJob}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default JobAlertArea;
