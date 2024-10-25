import React from "react";
import { Modal, Button } from "react-bootstrap";

interface JobListing {
  _id: string;
  title: string;
  description: string;
  responsibilities: string[];
  employer: string;
  salary: { currency: string; min: number; max: number };
  type: string;
  category: string;
}

interface ViewJobModalProps {
  show: boolean;
  onHide: () => void;
  job: JobListing | null;
}

const ViewJobModal: React.FC<ViewJobModalProps> = ({ show, onHide, job }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg" 
      centered  // Center the modal
      dialogClassName=""  // Apply a custom class for consistent styling
    >
      <Modal.Header closeButton>
        <Modal.Title>Job Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {job ? (
          <div className="dashboard-bod">
            <div className="dash-input-wrapper mb-30">
              <p><strong>Title:</strong> {job.title}</p>
            </div>
            <div className="dash-input-wrapper mb-30">
              <p><strong>Description:</strong> {job.description}</p>
            </div>
            <div className="dash-input-wrapper mb-30">
              <p><strong>Overview:</strong> {job.overview}</p>
            </div>
     
            <div className="dash-input-wrapper mb-30">
              <p><strong>Employer:</strong> {job.employer}</p>
            </div>
            <div className="dash-input-wrapper mb-30">
              <p><strong>Salary:</strong> {job.salary.currency} {job.salary.min} - {job.salary.max}</p>
            </div>
            <div className="dash-input-wrapper mb-30">
              <p><strong>Type:</strong> {job.type}</p>
            </div>
            <div className="dash-input-wrapper mb-30">
              <p><strong>Category:</strong> {job.category}</p>
            </div>
            <div className="dash-input-wrapper mb-30">
              <p><strong>Responsibilities:</strong></p>
              {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                <ol>
                  {job.responsibilities.flatMap((nestedArray, outerIndex) =>
                    nestedArray.map((responsibility, innerIndex) => (
                      <li key={`${outerIndex}_${innerIndex}`}>{responsibility}</li>
                    ))
                  )}
                </ol>
              ) : (
                <p>No responsibilities listed</p>
              )}
            </div>
          </div>
        ) : (
          <p>No job details available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewJobModal;
