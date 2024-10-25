import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import avatar from '@/assets/dashboard/images/avatar_04.jpg';
import CountrySelect from '../candidate/country-select';
import DashboardHeader from '../candidate/dashboard-header';

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmployProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<any>(null); // State to store user data

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          setErrorMessage('User not authenticated.');
          return;
        }

        const userData = JSON.parse(storedUserData);
        const token = userData.token;

        const response = await axios.get('http://localhost:5001/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data); // Store fetched user data in state
        setCompanyName(response.data.companyName || '');
        setCategory(response.data.category || '');
        setAboutCompany(response.data.aboutCompany || '');
        setCountry(response.data.address?.country || '');
        setCity(response.data.address?.city || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch user profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, []); // Run once on component mount

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        setErrorMessage('User not authenticated.');
        return;
      }

      const userData = JSON.parse(storedUserData);
      const token = userData.token;

      const user = {
        companyName,
        category,
        aboutCompany,
        address: {
          country,
          city,
        },
      };

      const updateResponse = await axios.put(
        'http://localhost:5001/api/users/profile',
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Update Response:', updateResponse.data);
      // Optionally handle response, update local state, show success message, etc.

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <h2 className="main-title">Profile</h2>

        <div className="bg-white card-box border-20">
          <form onSubmit={handleSave}>
            <div className="row">
              <div className="col-md-12">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Company Name*</label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Category*</label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="dash-input-wrapper">
              <label htmlFor="">About Company*</label>
              <textarea
                className="size-lg"
                placeholder="Write something interesting about your company."
                value={aboutCompany}
                onChange={(e) => setAboutCompany(e.target.value)}
                required
              ></textarea>
              <div className="alert-text">
                Brief description for your company. URLs are hyperlinked.
              </div>
            </div>
            

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="button-group d-inline-flex align-items-center mt-30">
              <button className="dash-btn-two tran3s me-3" type="submit">
                Save
              </button>
              <button className="dash-cancel-btn tran3s">Cancel</button>
            </div>
          </form>
        </div>

        {/* Display existing user profile data */}
        
      </div>
    </div>
  );
};

export default EmployProfileArea;
