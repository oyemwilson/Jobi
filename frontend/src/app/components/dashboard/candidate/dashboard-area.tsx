"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import DashboardHeader from "./dashboard-header";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";

// Card item component
export function CardItem({ img, value, title }) {
  return (
    <div className="col-lg-3 col-6">
      <div className="dash-card-one bg-white border-30 position-relative mb-15">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
            <Image src={img} alt="icon" className="lazy-img" />
          </div>
          <div className="order-sm-0">
            <div className="value fw-500">{value}</div>
            <span>{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const DashboardArea = ({ setIsOpenSidebar }: IProps) => {

  // Remove modal backdrop
   // Remove modal backdrop
   const backdropElement = typeof document !== 'undefined' ? document.querySelector('.modal-backdrop') : null;

   if (backdropElement) {
     backdropElement.remove();
   }

  // Ensure body overflow is not hidden
  document.body.style.overflow = 'auto'; // Enable scrolling
  
  // Remove modal-open class that Bootstrap adds to body to prevent scrolling
  document.body.classList.remove('modal-open');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          const token = userData.token;
  
          console.log("Fetching user data with token:", token);
  
          const response = await axios.get("http://localhost:5001/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const userDataFromServer = response.data;
          console.log("User data fetched:", userDataFromServer);
          setAppliedJobs(userDataFromServer.jobs || []);
        } else {
          console.warn("No userData found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (appliedJobs.length > 0) {
          console.log("Fetching job details for applied jobs:", appliedJobs);
  
          const jobPromises = appliedJobs.map(async (appliedJob) => {
            const response = await axios.get(`http://localhost:5001/api/joblistings/${appliedJob.job}`);
            console.log("Fetched job details for jobId:", appliedJob.job, response.data);
            return {
              ...response.data,
              status: appliedJob.status, // Attach status from user data
            };
          });
  
          const jobs = await Promise.all(jobPromises);
          setJobDetails(jobs);
          console.log("All job details fetched:", jobs);
        } else {
          console.warn("No applied jobs to fetch details for.");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
  
    fetchJobDetails();
  }, [appliedJobs]);
  

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobDetails.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">Dashboard</h2>
        <div className="">
          {/* <CardItem img={icon_1} title="Total Visitor" value="1.7k+" />
          <CardItem img={icon_2} title="Shortlisted" value="03" />
          <CardItem img={icon_3} title="Views" value="2.1k" /> */}
          <CardItem img={icon_4} title=" Total Applied Job" value={appliedJobs.length.toString()} />
        </div>

        <div className="row d-flex pt-50 lg-pt-10">
          <div className="col-xl-12 col-lg-12 d-flex">
            <div className="recent-job-tab bg-white border-20 mt-30 w-100">
              <h4 className="dash-title-two">Recently Applied Jobs</h4>
              <div className="wrapper">
                {currentJobs.length > 0 ? (
                  currentJobs.map((job, index) => (
                    <div key={index} className="job-item-list d-flex align-items-center">
                     
                      <div className="job-title">
                        <h6 className="mb-5">
                          <a href="#">{job.title}</a>
                        </h6>
                        <div className="meta">
                          <span>{job.type}</span> . <span>{job.location}</span>
                        </div>
                        <div className="status">
                          <span>{job.status}</span>
                        </div>
                      </div>
                      <div className="job-action">
                        {/* <button className="action-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <span></span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">View Job</a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">Archive</a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">Delete</a>
                          </li>
                        </ul> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recently applied jobs.</p>
                )}
              </div>

              {/* Pagination */}
              <div className="pagination mt-3">
                {Array.from({ length: Math.ceil(jobDetails.length / jobsPerPage) }, (_, i) => (
                  <button key={i + 1} onClick={() => paginate(i + 1)} className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardArea;
