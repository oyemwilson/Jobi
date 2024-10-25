"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import FilterArea from "../filter/filter-area";
import { fetchJobListings } from '@/redux/action/jobAction';
import icon from "@/assets/images/icon/icon_50.svg";
import ReactPaginate from 'react-paginate';
import Pagination from "@/ui/pagination";

const JobTable = () => {
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.job.jobListings || []);

  useEffect(() => {
    dispatch(fetchJobListings());
  }, [dispatch]);

  const [filterCriteria, setFilterCriteria] = useState({
    jobType: '',
    location: '',
    salary: { min: 0, max: Infinity },
    experience: '',
    category: '',
    tags: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Adjust items per page as needed

  const filterJobs = (jobs, criteria) => {
    if (!Array.isArray(jobs)) return []; // Ensure jobs is an array

    return jobs.filter((job) => {
      const { jobType, location, salary, experience, category, tags } = criteria;
      const { min: salaryMin, max: salaryMax } = salary;

      const matchesJobType = !jobType || job.type === jobType;
      const matchesLocation = !location || (job.country ?? '').includes(location);
      const matchesSalary = salaryMin <= job.salary.min && job.salary.max <= salaryMax;
      const matchesExperience = !experience || job.experience === experience;
      const matchesCategory = !category || job.category === category;
      const matchesTags = tags.length === 0 || (Array.isArray(job.tags) && tags.every(tag => job.tags.includes(tag)));

      return matchesJobType && matchesLocation && matchesSalary && matchesExperience && matchesCategory && matchesTags;
    });
  };

  const filteredJobs = filterJobs(jobData, filterCriteria);

  // Pagination Logic
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Number of pages
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <button
              type="button"
              className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
              data-bs-toggle="offcanvas"
              data-bs-target="#filteroffcanvas"
            >
              <i className="bi bi-funnel"></i>
              Filter
            </button>
            <div>
              <FilterArea
                setFilterCriteria={setFilterCriteria}
                priceValue={[0, 100000]} // Adjust as per your needs
                setPriceValue={() => {}} // Placeholder function
                maxPrice={100000} // Adjust max as per your needs
              />
            </div>
          </div>
          <div className="col-xl-9 col-lg-8 mt-2">
            <div className="">
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  {filteredJobs.length} jobs found
                </div>
              </div>
              <div className="job-list-container mt-4 row">
                {currentJobs.map((job) => (
                  <div key={job._id} className="job-list-one style-two position-relative border-style mb-4 p-3 shadow-sm bg-white">
                    <div className="row justify-content-between align-items-center">
                      <div className="col-md-5">
                        <div className="job-title d-flex align-items-center">
                          <Link href={`/job-details-v1/${job._id}`} className="logo">
                            {/* You can place a logo or icon here */}
                          </Link>
                          <div className="split-box1 ms-3">
                            <Link href={`/job-details-v1/${job._id}`} className="job-duration fw-500 d-block">
                              {job.type}
                            </Link>
                            <Link href={`/job-details-v1/${job._id}`} className="title fw-500 tran3s d-block">
                              {job.title.length > 22 ? `${job.title.slice(0, 22)}...` : job.title}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="job-location">
                          <Link href={`/job-details-v1/${job._id}`} className="text-dark d-block">
                            {job.country}
                          </Link>
                        </div>
                        <div className="job-salary">
                          <span className="fw-500 text-dark">
                            {job.salary.currency} {job.salary.min} - {job.salary.max}
                          </span>
                          <span className="text-muted"> / {job.experience}</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="btn-group d-flex align-items-center justify-content-sm-end mt-2 mt-sm-0">
                          <button
                            onClick={() => console.log('Add to wishlist', job)}
                            className="save-btn text-center rounded-circle tran3s me-3 cursor-pointer"
                            title="Save Job"
                          >
                            <i className="bi bi-bookmark"></i>
                          </button>
                          <Link
                            href={`/job-details-v1/${job._id}`}
                            className="apply-btn text-center tran3s"
                          >
                            APPLY
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="dash-pagination d-flex justify-content-end mt-30">
                <ul className="style-none d-flex align-items-center">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index} className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <a href="#"  onClick={() => paginate(index + 1)}>{index + 1}</a>
                    </li>
                  ))}
                   <li><a href="#"><i className="bi bi-chevron-right"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobTable;
