import React, { useState } from 'react';

const ChangePasswordArea = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    // Retrieve token from localStorage
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.error('User data not found');
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData.token;

    // API call to change password
    try {
      const response = await fetch('http://localhost:5001/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          email: userData.email, // Include the email in the request body
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        // Handle error response from backend
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to change password.');
        return;
      }

      // Password changed successfully
      setErrorMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while changing password.');
    }
  };

  return (
    <div className="mt-45">
      <div className="position-relative">
        <h2 className="main-title">Change Password</h2>
        <div className="bg-white card-box border-20">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="oldPassword">Old Password*</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="newPassword">New Password*</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <div className="button-group d-inline-flex align-items-center">
              <button type="submit" className="dash-btn-two tran3s rounded-3">
                Save & Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordArea;
