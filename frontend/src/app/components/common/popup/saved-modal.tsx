import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type SavedPopupProps = {
  show: boolean;
  onClose: () => void;
};

const SavedPopup: React.FC<SavedPopupProps> = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Job Saved</Modal.Title>
      </Modal.Header>
      <Modal.Body>Your job has been saved successfully!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SavedPopup;
