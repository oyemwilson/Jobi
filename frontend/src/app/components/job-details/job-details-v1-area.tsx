"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

const JobDetailsV1Area = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const pathname = window.location.pathname;
      const jobId = pathname.split('/').pop(); // Extract jobId from the pathname
      console.log("id:", jobId);

      if (jobId) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://localhost:5001/api/joblistings/${jobId}`);
          setJobDetails(response.data); // Assuming your API response returns job details
        } catch (error) {
          console.error('Error fetching job details:', error);
          setError('Error fetching job details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Placeholder for loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Placeholder for error state
  }

  if (!jobDetails) {
    return <div>No job details available.</div>; // Placeholder if no job details are returned
  }

  return (
    <section className="job-details pt-100 lg-pt-80 pb-130 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-8">
            <div className="details-post-data me-xxl-5 pe-xxl-4">
              <div className="post-date">
                {new Date(jobDetails.createdAt).toLocaleDateString()} by 
                <a href="#" className="fw-500 text-dark"> {jobDetails.employer}</a>
              </div>
              <h3 className="post-title">{jobDetails.title}</h3>
              <ul className="share-buttons d-flex flex-wrap style-none">
                <li><a href="#" className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-facebook"></i>
                  <span>Facebook</span>
                </a></li>
                <li><a href="#" className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-twitter"></i>
                  <span>Twitter</span>
                </a></li>
                <li><a href="#" className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-link-45deg"></i>
                  <span>Copy</span>
                </a></li>
              </ul>

              <div className="post-block border-style mt-50 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">1</div>
                  <h4 className="block-title">Overview</h4>
                </div>
                <p>{jobDetails.overview}</p>
              </div>

              <div className="post-block border-style mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">2</div>
                  <h4 className="block-title">Job Description</h4>
                </div>
                <p>{jobDetails.description}</p>
              </div>

              <div className="post-block border-style mt-40 lg-mt-30">
  <div className="d-flex align-items-center">
    <div className="block-numb text-center fw-500 text-white rounded-circle me-2">3</div>
    <h4 className="block-title">Responsibilities</h4>
  </div>
  <ul className="list-type-one style-none mb-15">
    {Array.isArray(jobDetails.responsibilities) &&
    jobDetails.responsibilities.length > 0 ? (
      jobDetails.responsibilities.flatMap((nestedArray) =>
        nestedArray.map((responsibility, index) => (
          <li key={`${nestedArray.indexOf(responsibility)}_${index}`}>{responsibility}</li>
        ))
      )
    ) : (
      <li>No responsibilities listed</li>
    )}
  </ul>
{/* </div>

              <div className="post-block border-style mt-40 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">4</div>
                  <h4 className="block-title">Required Skills:</h4>
                </div> */}
                {/* <ul className="list-type-two style-none mb-15">
                  {jobDetails.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul> */}
              </div>

              {/* <div className="post-block border-style mt-40 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">5</div>
                  <h4 className="block-title">Benefits:</h4>
                </div>
                <ul className="list-type-two style-none mb-15">
                  {jobDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4">
            <div className="job-company-info ms-xl-5 ms-xxl-0 lg-mt-50">
              {/* <Image src={jobDetails.logo} alt="logo" className="lazy-img m-auto logo" width={60} height={60} /> */}
              <div className="text-md text-dark text-center mt-15 mb-20 text-capitalize">{jobDetails.employer}</div>
              {/* <a href="#" className="website-btn tran3s">Save</a> */}

              <div className="border-top mt-40 pt-40">
                <ul className="job-meta-data row style-none">
                  <li className="col-xl-7 col-md-4 col-sm-6">
                    <span>Salary: </span>
                    	{jobDetails.salary.currency} {jobDetails.salary.min} - {jobDetails.salary.max}
                  </li>
                  <li className="col-xl-5 col-md-4 col-sm-6">
                    <span>Category</span>
                    <div>{jobDetails.category}</div>
                  </li>
                  <li className="col-xl-7 col-md-4 col-sm-6">
                    <span>Location</span>
                    <div>{jobDetails.address}</div>
                  </li>
                  <li className="col-xl-5 col-md-4 col-sm-6">
                    <span>Job Type</span>
                    <div>{jobDetails.type}</div>
                  </li>
                  <li className="col-xl-7 col-md-4 col-sm-6">
                    <span>Date</span>
                    <div>{new Date(jobDetails.createdAt).toLocaleDateString()}</div>
                  </li>
                  <li className="col-xl-5 col-md-4 col-sm-6">
                    <span>Experience</span>
                    <div>{jobDetails.experience}</div>
                  </li>
                </ul>
                {/* <div className="job-tags d-flex flex-wrap pt-15">
                  {jobDetails.tags.map((tag, index) => (
                    <a key={index} href="#">{tag}</a>
                  ))}
                </div> */}
                <a href="#" className="btn-one w-100 mt-25">Apply Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsV1Area;
