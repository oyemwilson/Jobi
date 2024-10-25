import React, { useState, useEffect } from "react";
// import DashboardHeader from "./dashboard-header";
// import ChangePasswordArea from "./change-password";
import axios from "axios";
import { AxiosError } from "axios";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardSettingArea = ({ setIsOpenSidebar }: IProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          const token = userData.token; // Extract token from userData object
          const response = await axios.get("http://localhost:5001/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userDataFromServer = response.data;
          console.log(userDataFromServer);
          setName(userDataFromServer.name || ""); // Make sure to set default value to empty string if data is not available
          setEmail(userDataFromServer.email || "");
          setPhoneNumber(userDataFromServer.phoneNumber || ""); // Set phoneNumber state with the value from server
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authResponse = await axios.post("http://localhost:5001/api/users/login", {
        email,
        password,
      });
      const authToken = authResponse.data.token;
  
      const updateResponse = await axios.put("http://localhost:5001/api/users/profile", {
        name,
        email,
        phoneNumber, // Include the phoneNumber field in the update request
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("User updated successfully:", updateResponse.data);
  
      // Update localStorage
      const userDataToUpdate = {
        name,
        email,
        phoneNumber, // Include phoneNumber state
        token: authToken // Make sure to include the token if you're storing it in localStorage
      };
      localStorage.setItem('userData', JSON.stringify(userDataToUpdate));
  
      // Dispatch action to update Redux state
      // For example, if you have a updateUser action and userReducer:
      // dispatch(updateUser(userDataToUpdate));
  
      window.location.reload();
      // Optionally, show a success message or update state
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle the error and alert the appropriate message
      const responseError = error as AxiosError;
      if (responseError.response && responseError.response.status === 401) {
        alert("Authentication failed. Please check your email and password.");
      } else {
        alert("Error updating user. Please try again later.");
      }
    }
  };
  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} /> */}
        <h2 className="main-title">Account Settings</h2>
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Edit & Update</h4>
          <form onSubmit={handleSave}>
            <div className="row">
              <div className="col-lg-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">Email</label>
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
                  <label htmlFor="">Phone Number</label>
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
                  <label htmlFor="">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
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
        {/* <ChangePasswordArea /> */}
      </div>
    </div>
  );
};

export default DashboardSettingArea;
