import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

interface JobApplication {
  job: string;
  status: 'Selected' | 'Not Selected' | 'Applied' | 'Not Applied';
}

interface Applicant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  appliedJobs: JobApplication[];
  cvPath?: string;
  coverLetterPath?: string;
}

interface ApplicantsModalProps {
  show: boolean;
  onHide: () => void;
  jobId: string;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({
  show,
  onHide,
  jobId,
}) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (show) {
      fetchApplicants();
    }
  }, [show, jobId]);

  const fetchApplicants = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        setMessage("Not authorized, no token found");
        return;
      }

      const userData = JSON.parse(userDataString);
      const { token } = userData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:5001/api/joblistings/applicants/${jobId}`,
        config
      );

      if (response.data && response.data.applicants) {
        setApplicants(response.data.applicants);
      } else {
        setMessage("No applicants found");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setMessage("Error fetching applicants");
    }
  };

  const handleViewFile = useCallback(async (applicantId: string, fileType: 'cv' | 'coverLetter') => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        setMessage("Not authorized, no token found");
        return;
      }
  
      const userData = JSON.parse(userDataString);
      const { token } = userData;
  
      const response = await axios.get(
        `http://localhost:5001/api/view/${fileType}/${applicantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
  
      if (response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Open the PDF file in a new tab
        window.open(url, '_blank');
  
        // Clean up the URL object
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(`Error viewing ${fileType}:`, error);
      setMessage(`Error viewing ${fileType}`);
    }
  }, [jobId]);

  const handleStatusChange = (applicantId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value as 'Selected' | 'Not Selected' | 'Applied' | 'Not Applied';

    const updatedApplicant = applicants.find(applicant => applicant._id === applicantId);
    if (updatedApplicant) {
      handleUpdateStatus(updatedApplicant, selectedStatus);
    }
  };

  const handleUpdateStatus = async (updatedApplicant: Applicant, selectedStatus: string) => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        setMessage("Not authorized, no token found");
        return;
      }

      const userData = JSON.parse(userDataString);
      const { token } = userData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const jobApplication = updatedApplicant.appliedJobs.find(job => job.job === jobId);
      if (jobApplication) {
        await axios.put(
          `http://localhost:5001/api/jobstatus/${jobId}/status`,
          {
            status: selectedStatus,
            viewed: true,
          },
          config
        );

        // Update local state
        setApplicants(prevApplicants =>
          prevApplicants.map(applicant =>
            applicant._id === updatedApplicant._id
              ? {
                  ...applicant,
                  appliedJobs: applicant.appliedJobs.map(job =>
                    job.job === jobId ? { ...job, status: selectedStatus } : job
                  ),
                }
              : applicant
          )
        );
      } else {
        setMessage("Invalid job application");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Error updating status");
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-lg">
      <Modal.Header closeButton>
        <Modal.Title>Applicants</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="dashboard-body" style={{ marginLeft: '0px', borderRadius: '0px' }}>
          {message && <div className="alert alert-info">{message}</div>}
          <table className="table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>CV</th>
                <th>Cover Letter</th>
              </tr>
            </thead>
            <tbody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <tr key={applicant._id}>
                    <td>{applicant.firstName}</td>
                    <td>{applicant.lastName}</td>
                    <td>{applicant.email}</td>
                    <td>
                      {applicant.cvPath ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewFile(applicant._id, 'cv')}
                          aria-label="View CV"
                        >
                          View CV
                        </button>
                      ) : (
                        <span>No CV</span>
                      )}
                    </td>
                    <td>
                      {applicant.coverLetterPath ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewFile(applicant._id, 'coverLetter')}
                          aria-label="View Cover Letter"
                        >
                          View Cover Letter
                        </button>
                      ) : (
                        <span>No Cover Letter</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No applicants available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApplicantsModal;
