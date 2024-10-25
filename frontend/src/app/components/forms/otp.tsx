// OTPPopup.tsx
import React, { useState } from 'react';

interface OTPPopupProps {
  onSubmitOTP: (otp: string) => void;
}

const OTPPopup: React.FC<OTPPopupProps> = ({ onSubmitOTP }) => {
  const [otp, setOTP] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otp) {
      setErrorMessage('Please enter OTP');
      return;
    }
    onSubmitOTP(otp);
  };

  return (
    <div className="otp-popup">
      <form onSubmit={handleSubmit}>
        <input type="text" value={otp} onChange={handleChange} placeholder="Enter OTP" />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Submit OTP</button>
      </form>
    </div>
  );
};

export default OTPPopup;
