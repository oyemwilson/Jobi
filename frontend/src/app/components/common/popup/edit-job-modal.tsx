import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import NiceSelect from "@/ui/nice-select";

interface JobListing {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  employer: string;
}

interface EditJobModalProps {
  show: boolean;
  onHide: () => void;
  jobId: string;
  onUpdateSuccess: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ show, onHide, jobId, onUpdateSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("");
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://localhost:5001/api/joblistings/${jobId}`, config);
        const { title, description, overview, category, type, experience, address, country, state, responsibilities, salary: { currency:salaryCurrency, min: salaryMin, max: salaryMax } } = response.data;
        const responsibilitiesString = responsibilities.join('\n');
        setTitle(title);
        setDescription(description);
        setOverview(overview);
        setCategory(category);
        setType(type);
        setSalaryCurrency(salaryCurrency);
        setSalaryMin(salaryMin);
        setSalaryMax(salaryMax);
        setExperience(experience);
        setAddress(address);
        setCountry(country);
        setState(state);
        setResponsibilities(responsibilitiesString);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    if (show && jobId) {
      fetchJobDetails();
    }
  }, [show, jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const updatedJobData = {
        title,
        description,
        overview,
        category,
        type,
        experience,
        address,
        country,
        state,
        responsibilities: responsibilities.split('\n'), // Ensure this is an array
        salary: { min: salaryMin, max: salaryMax }
      };

      await axios.put(`http://localhost:5001/api/joblistings/${jobId}`, updatedJobData, config);
      onUpdateSuccess();
      onHide();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };
  

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"  // Ensures the modal is of large size
      centered  // Centers the modal on the screen
      dialogClassName="custom-modal"  // Custom class for additional styling
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Job</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="dashboard-bod">
          <div className="">
            <div className="">
              <h4 className="dash-title-three"></h4>
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Title*</label>
                <input
                
                  type="text"
                  placeholder="Enter job title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="description">Description*</label>
                <textarea
                  className="size-lg"
                  placeholder="Enter job description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="overview">Overview*</label>
                <textarea
                  className="size-lg"
                  placeholder="Enter job overview"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                ></textarea>
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
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="dash-input-wrapper mb-30">
                  <label htmlFor="category">Currency*</label>
                    <input
                      type="text"
                      placeholder="Currency"
                      value={salaryCurrency}
                      onChange={(e) => setSalaryCurrency(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="dash-input-wrapper mb-30">
                  <label htmlFor="category">Salary Min*</label>
                    <input
                      type="text"
                      placeholder="Min"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="dash-input-wrapper mb-30">
                  <label htmlFor="category">Salary Max*</label>
                    <input
                      type="text"
                      placeholder="Max"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                    />
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
                  </div>
                </div>
              </div>

              <div className="col-12">
  <div className="dash-input-wrapper mb-30">
    <label htmlFor="responsibilities">Responsibilities*</label>
    <textarea

      className="large-textarea" // Added CSS class for further styling
      rows={10} // Increase the number of rows
      placeholder="Enter responsibilities each on a new line"
      value={responsibilities}
      onChange={(e) => setResponsibilities(e.target.value)}
    ></textarea>
  </div>
</div>

            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditJobModal;
