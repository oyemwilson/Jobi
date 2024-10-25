import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header";
import ChangePasswordArea from "./change-password";
import axios from "axios";
import { AxiosError } from "axios";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardSettingArea = ({ setIsOpenSidebar }: IProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          const token = userData.token;
          const response = await axios.get("http://localhost:5001/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userDataFromServer = response.data;
          console.log(userDataFromServer);
          setFirstName(userDataFromServer.firstName || "");
          setLastName(userDataFromServer.lastName || "");
          setEmail(userDataFromServer.email || "");
          setPhoneNumber(userDataFromServer.phoneNumber || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        setErrorMessage("User not authenticated.");
        return;
      }

      const userData = JSON.parse(storedUserData);
      const token = userData.token;

      const updateResponse = await axios.put(
        "http://localhost:5001/api/users/profile",
        {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User updated successfully:", updateResponse.data);

      const updatedUserData = {
        ...userData,
        firstName,
        lastName,
        email,
        phoneNumber,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      const responseError = error as AxiosError;
      if (responseError.response && responseError.response.status === 401) {
        setErrorMessage("Authentication failed. Please log in again.");
      } else {
        setErrorMessage("Error updating user. Please try again later.");
      }
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">Account Settings</h2>
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Edit & Update</h4>
          <form onSubmit={handleSave}>
            <div className="row">
              <div className="col-lg-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+810 321 889 021"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="button-group d-inline-flex align-items-center mt-30">
              <button type="submit" className="dash-btn-two tran3s me-3 rounded-3">
                Save
              </button>
              <button type="button" className="dash-cancel-btn tran3s">
                Cancel
              </button>
            </div>
          </form>
        </div>
        <ChangePasswordArea />
      </div>
    </div>
  );
};

export default DashboardSettingArea;
