"use client";
import React, { useState } from "react"; // Import useState hook
import axios from "axios";
import Image from "next/image";
import DashboardHeader from "../candidate/dashboard-header";
import StateSelect from "../candidate/state-select";
import CitySelect from "../candidate/city-select";
import CountrySelect from "../candidate/country-select";
import icon from "@/assets/dashboard/images/icon/icon_16.svg";
import NiceSelect from "@/ui/nice-select";

const SubmitJobArea = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleExperience = (item) => {
    setExperience(item.value);
  };

  const handleCategory = (item) => {
    setCategory(item.value);
  };

  const handleType = (item) => {
    setType(item.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({});

    // Validate form fields
    const errors = {};
    if (!title) errors.title = 'Title is required';
    if (!description) errors.description = 'Description is required';
    if (!overview) errors.overview = 'Overview is required';
    if (!category) errors.category = 'Category is required';
    if (!type) errors.type = 'Type is required';
    if (!salaryMin) errors.salaryMin = 'Minimum salary is required';
    if (!salaryMax) errors.salaryMax = 'Maximum salary is required';
    if (!experience) errors.experience = 'Experience is required';
    if (!address) errors.address = 'Address is required';
    if (!country) errors.country = 'Country is required';
    if (!state) errors.state = 'State is required';
    if (!responsibilities) errors.responsibilities = 'Responsibilities are required';

    // If there are errors, set them in the state and return
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Example logic to handle form submission
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) {
      console.error("User data not found in localStorage");
      return; // Exit early if user data is not found
    }

    try {
      const userData = JSON.parse(userDataString);
      const token = userData.token;

      // Formulate job data
      const newJobData = {
        title,
        description,
        overview,
        category,
        type,
        salaryMin: parseInt(salaryMin),
        salaryMax: parseInt(salaryMax),
        experience,
        address,
        country,
        state,
        responsibilities: responsibilities.split("\n"), // Split responsibilities by new line
      };

      // Submit job data with authorization header
      const response = await axios.post("http://localhost:5001/api/joblistings", newJobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Job posted successfully:", response.data);
      alert("Job posted successfully");

      // Clear form fields after successful submission
      setTitle("");
      setDescription("");
      setOverview("");
      setCategory("");
      setType("");
      setSalaryMin("");
      setSalaryMax("");
      setExperience("");
      setAddress("");
      setCountry("");
      setState("");
      setResponsibilities("");

      // Optionally, redirect to another page after successful submission
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job");
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />

        <h2 className="main-title">Post a New Job</h2>

        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Job Details</h4>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && <p className="error-message"style={{ color: 'red' }}>{formErrors.title}</p>}
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="description">Description*</label>
            <textarea
              className="size-lg"
              placeholder="Enter job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {formErrors.description && <p className="error-message"style={{ color: 'red' }}>{formErrors.description}</p>}
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="overview">Overview*</label>
            <textarea
              className="size-lg"
              placeholder="Enter job overview"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            ></textarea>
            {formErrors.overview && <p className="error-message"style={{ color: 'red' }}>{formErrors.overview}</p>}
          </div>
          <div className="row align-items-end">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="category">Category*</label>
                <NiceSelect
                  options={[
                    { value: "Designer", label: "Designer" },
                    { value: "IT & Development", label: "IT & Development" },
                    { value: "Web & Mobile Dev", label: "Web & Mobile Dev" },
                    { value: "Writing", label: "Writing" },
                  ]}
                  defaultCurrent={0}
                  onChange={handleCategory}
                  name="Job Category"
                  placeholder="Select a category"
                />
                {formErrors.category && <p className="error-message"style={{ color: 'red' }}>{formErrors.category}</p>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="type">Type*</label>
                <NiceSelect
                  options={[
                    { value: "Full time", label: "Full time" },
                    { value: "Part time", label: "Part time" },
                    { value: "Hourly-Contract", label: "Hourly-Contract" },
                    { value: "Fixed-Price", label: "Fixed-Price" },
                  ]}
                  defaultCurrent={0}
                  onChange={handleType}
                  name="Job Type"
                />
                {formErrors.type && <p className="error-message"style={{ color: 'red' }}>{formErrors.type}</p>}
              </div>
            </div>
            <div className="col-md-3">
              <div className="dash-input-wrapper mb-30">
                <input
                  type="text"
                  placeholder="Min"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
                {formErrors.salaryMin && <p className="error-message"style={{ color: 'red' }}>{formErrors.salaryMin}</p>}
              </div>
            </div>
            <div className="col-md-3">
              <div className="dash-input-wrapper mb-30">
                <input
                  type="text"
                  placeholder="Max"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
                {formErrors.salaryMax && <p className="error-message"style={{ color: 'red' }}>{formErrors.salaryMax}</p>}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="experience">Experience*</label>
              <NiceSelect
                options={[
                  { value: "Intermediate", label: "Intermediate" },
                  { value: "No-Experience", label: "No-Experience" },
                  { value: "Expert", label: "Expert" },
                ]}
                defaultCurrent={0}
                onChange={handleExperience}
                name="Experience"
              />
              {formErrors.experience && <p className="error-message"style={{ color: 'red' }}>{formErrors.experience}</p>}
            </div>
          </div>

          <h4 className="dash-title-three pt-50 lg-pt-30">Address & Location</h4>
          <div className="row">
            <div className="col-12">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="address">Address*</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {formErrors.address && <p className="error-message"style={{ color: 'red' }}>{formErrors.address}</p>}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="country">Country*</label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                {formErrors.country && <p className="error-message"style={{ color: 'red' }}>{formErrors.country}</p>}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="state">State*</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {formErrors.state && <p className="error-message"style={{ color: 'red' }}>{formErrors.state}</p>}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="responsibilities">Responsibilities*</label>
              <textarea
                rows={4}
                placeholder="Enter responsibilities each on a new line"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              ></textarea>
              {formErrors.responsibilities && <p className="error-message"style={{ color: 'red' }}>{formErrors.responsibilities}</p>}
            </div>
          </div>

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button
              className="dash-btn-two tran3s me-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button className="dash-cancel-btn tran3s">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitJobArea;
