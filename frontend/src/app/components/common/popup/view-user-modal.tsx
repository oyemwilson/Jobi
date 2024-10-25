import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios'; // Import Axios for HTTP requests

type UserDetailsModalProps = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    isAdmin: boolean;
    role: string;
    verified: boolean;
  } | null;
  show: boolean;
  onHide: () => void;
  onEditSuccess: () => void; // Callback function after successful edit
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, show, onHide, onEditSuccess }) => {
  const [editedUser, setEditedUser] = useState(user ? { ...user } : null);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleClose = () => {
    onHide();
  };

  const handleEdit = async () => {
    try {
      // Fetch token from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = userData.token;

      if (!token) {
        throw new Error('Token not found');
      }

      if (editedUser && editedUser._id) {
        const response = await axios.put(`http://localhost:5001/api/users/${editedUser._id}`, editedUser, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
            'Content-Type': 'application/json'
          }
        });

        console.log('Edit user response:', response.data);
        onEditSuccess(); // Notify parent component of successful edit
        onHide(); // Close the modal after editing
      }
    } catch (error) {
      console.error('Error editing user:', error);
      if (error.response && error.response.status === 401) {
        alert('Authorization error: Please log in again.');
        // Optionally, redirect to login page
      } else {
        // Handle other errors (e.g., display error message)
        alert('An error occurred while editing the user.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!editedUser) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={editedUser.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={editedUser.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              value={editedUser.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isAdmin"
              name="isAdmin"
              checked={editedUser.isAdmin}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isAdmin">Admin</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={editedUser.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="employer">Employer</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="verified"
              name="verified"
              checked={editedUser.verified}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="verified">Verified</label>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
