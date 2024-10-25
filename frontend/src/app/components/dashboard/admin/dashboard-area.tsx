import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import main_graph from "@/assets/dashboard/images/main-graph.png";
import DashboardHeader from "../candidate/dashboard-header";
import NiceSelect from "@/ui/nice-select";
import axios from "axios";

// card item
export function CardItem({
  img,
  value,
  title,
}: {
  img: StaticImageData;
  value: string;
  title: string;
}) {
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

// props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminDashboardArea = ({ setIsOpenSidebar }: IProps) => {
  // Remove modal backdrop
  const backdropElement = document.querySelector('.modal-backdrop');
  if (backdropElement) {
    backdropElement.remove();
  }

  // Ensure body overflow is not hidden
  document.body.style.overflow = 'auto'; // Enable scrolling
  
  // Remove modal-open class that Bootstrap adds to body to prevent scrolling
  document.body.classList.remove('modal-open');


  const [jobListings, setJobListings] = useState<JobListing[]>([]);

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:5001/api/joblistings/user",
        config
      );
      setJobListings(response.data);
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  const handleJobs = (item: { value: string; label: string }) => {};

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

        <h2 className="main-title">Dashboard</h2>
        <div className="row">
          <CardItem img={icon_1} title="Applications" value="1.7k+" />
          <CardItem img={icon_2} title="Shortlisted" value="03" />
          <CardItem img={icon_3} title="Views" value="2.1k" />
          <CardItem img={icon_4} title="Posted Jobs" value="07" />
        </div>
        <div className="row">
          <div className="col-xl-12 col-lg-12 d-flex flex-column">
            {/* <div className="user-activity-chart bg-white border-20 mt-30 h-100"> */}
              {/* <h4 className="dash-title-two">Job Views</h4> */}
              {/* <div className="d-sm-flex align-items-center job-list">
                <div className="fw-500 pe-3">Jobs:</div>
                <div className="flex-fill xs-mt-10">
                  <NiceSelect
                    options={[
                      {
                        value: "Web-&-Mobile-Prototype-designer",
                        label: "Web & Mobile Prototype designer....",
                      },
                      { value: "Document Writer", label: "Document Writer" },
                      {
                        value: "Outbound Call Service",
                        label: "Outbound Call Service",
                      },
                      { value: "Product Designer", label: "Product Designer" },
                    ]}
                    defaultCurrent={0}
                    onChange={(item) => handleJobs(item)}
                    name="Search Jobs"
                  />
                </div>
              </div> */}
              {/* <div className="ps-5 pe-5 mt-50">
                <Image
                  src={main_graph}
                  alt="main-graph"
                  className="lazy-img m-auto"
                />
              </div> */}
            {/* </div> */}
          </div>
          <div className="col-xl-12 col-lg-12 d-flex">
            <div className="recent-job-tab bg-white border-20 mt-30 w-100">
              <h4 className="dash-title-two">Notifications</h4>
              <div className="wrapper">
                {jobListings.map((job) => (
                  <div
                    key={job._id}
                    className="job-item-list d-flex align-items-center"
                  >
                    {/* <div>
                      <Image
                        src={job.logo}
                        alt="logo"
                        width={40}
                        height={40}
                        className="lazy-img logo"
                      />
                    </div> */}
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
                          <a className="dropdown-item" href="/dashboard/employ-dashboard/jobs">
                            View Job
                          </a>
                        </li>
                        {/* <li>
                          <a className="dropdown-item" href="#">
                            Archive
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Delete
                          </a>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardArea;
