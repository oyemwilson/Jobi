import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import DashboardHeader from "../candidate/dashboard-header";

// Card item component
export function CardItem({ img, value, title }: { img: StaticImageData; value: string; title: string; }) {
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

// Job listing interface
interface JobListing {
  _id: string;
  title: string;
  employer: string;
  requirements: string;
  logo?: string; // Optional, in case logo is included
}

// Props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmployDashboardArea = ({ setIsOpenSidebar }: IProps) => {
  const backdropElement = typeof document !== 'undefined' ? document.querySelector('.modal-backdrop') : null;

   if (backdropElement) {
     backdropElement.remove();
   }

  // Ensure body overflow is not hidden
  document.body.style.overflow = 'auto'; // Enable scrolling
  
  // Remove modal-open class that Bootstrap adds to body to prevent scrolling
  document.body.classList.remove('modal-open');
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const token = userData.token;

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("http://localhost:5001/api/joblistings/user", config);

      if (response.data.length > 0) {
        setJobListings(response.data);
      } else {
        setJobListings([]);
        setError("No posted jobs available");
      }
    } catch (error) {
      console.error("Error fetching job listings:", error);
      setError("Failed to fetch job listings");
    }
  };

  // Handle user clicking on a job
  const handleJobClick = (jobId: string) => {
    console.log("Job clicked:", jobId);
    // Redirect or show job details
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* Header */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <h2 className="main-title">Dashboard</h2>
        <div className="row">
          {/* <CardItem img={icon_1} title="Applications" value="1.7k+" />
          <CardItem img={icon_2} title="Shortlisted" value="03" />
          <CardItem img={icon_3} title="Views" value="2.1k" /> */}
          <CardItem img={icon_4} title="Posted Jobs" value={jobListings.length.toString()} />
        </div>

        <div className="row">
          <div className="col-xl-12 col-lg-12 d-flex">
            <div className="recent-job-tab bg-white border-20 mt-30 w-100">
              <h4 className="dash-title-two">Posted Jobs</h4>
              <div className="wrapper">
                {error ? (
                  <p className="text-danger">{error}</p>
                ) : jobListings.length > 0 ? (
                  jobListings.map((job) => (
                    <div
                      key={job._id}
                      className="job-item-list d-flex align-items-center"
                      onClick={() => handleJobClick(job._id)}
                    >
                      {job.logo && (
                        <div>
                          <Image
                            src={job.logo}
                            alt="logo"
                            width={40}
                            height={40}
                            className="lazy-img logo"
                          />
                        </div>
                      )}
                      <div className="job-title">
                        <h6 className="mb-5">
                          <a href="#">{job.title}</a>
                        </h6>
                        <div className="meta">
                          <span>{job.employer}</span> . <span>{job.requirements}</span>
                        </div>
                      </div>
                      <div className="job-action">
                        <button
                          className="action-btn dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span></span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href={`/dashboard/employ-dashboard/jobs/${job._id}`}>
                              View Job
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No posted jobs found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployDashboardArea;
