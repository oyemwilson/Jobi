import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type AppliedPopupProps = {
  show: boolean;
  onClose: () => void;
};

const AppliedPopup: React.FC<AppliedPopupProps> = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Job Applied</Modal.Title>
      </Modal.Header>
      <Modal.Body>You have successfully applied for the job!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppliedPopup;
