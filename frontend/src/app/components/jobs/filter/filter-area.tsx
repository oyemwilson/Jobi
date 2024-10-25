"use client";
import React, { useState } from 'react';

type FilterCriteria = {
  jobType: string;
  location: string;
  salary: { min: number; max: number };
  experience: string;
  category: string;
  tags: string[];
};

type IProps = {
  setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  priceValue: number[];
  setPriceValue: React.Dispatch<React.SetStateAction<number[]>>;
  maxPrice: number;
};

const FilterArea: React.FC<IProps> = ({ setFilterCriteria, priceValue, setPriceValue, maxPrice }) => {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]); // Initialize tags as an empty array

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    setFilterCriteria(prev => ({ ...prev, location: value }));
  };

  const handleJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setJobType(value);
    setFilterCriteria(prev => ({ ...prev, jobType: value }));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setExperience(value);
    setFilterCriteria(prev => ({ ...prev, experience: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory(value);
    setFilterCriteria(prev => ({ ...prev, category: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    setTags(prevTags => {
      const newTags = e.target.checked ? [...prevTags, tag] : prevTags.filter(t => t !== tag);
      setFilterCriteria(prev => ({ ...prev, tags: newTags }));
      return newTags;
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(e.target.value);
    setPriceValue(prevPrice => {
      const newPriceValue = [...prevPrice];
      newPriceValue[index] = value;
      setFilterCriteria(prev => ({ ...prev, salary: { min: newPriceValue[0], max: newPriceValue[1] } }));
      return newPriceValue;
    });
  };

  const handleReset = () => {
    setFilterCriteria({
      jobType: '',
      location: '',
      salary: { min: 0, max: maxPrice },
      experience: '',
      category: '',
      tags: [],
    });
    setLocation('');
    setJobType('');
    setExperience('');
    setCategory('');
    setTags([]);
    setPriceValue([0, maxPrice]);
  };

  return (
    <div className="filter-area-tab offcanvas offcanvas-start" id="filteroffcanvas">
      <button type="button" className="btn-close text-reset d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <div className="main-title fw-500 text-dark">Filter By</div>
      <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">

        {/* Location Filter */}
        <div className="filter-block bottom-line pb-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseLocation" role="button" aria-expanded="false">
            Location
          </a>
          <div className="collapse show" id="collapseLocation">
            <div className="main-body">
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="Enter Location"
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Job Type Filter */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseJobType" role="button" aria-expanded="false">
            Job Type
          </a>
          <div className="collapse show" id="collapseJobType">
            <select value={jobType} onChange={handleJobTypeChange} className="form-select">
              <option value="">Select Job Type</option>
              <option value="Full time">Full-Time</option>
              <option value="Part time">Part-Time</option>
              <option value="Hourly-Contract">Hourly Contract</option>
            </select>
          </div>
        </div>

        {/* Experience Filter */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseExp" role="button" aria-expanded="false">
            Experience
          </a>
          <div className="collapse show" id="collapseExp">
            <select value={experience} onChange={handleExperienceChange} className="form-select">
              <option value="">Select Experience Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>
        </div>

        {/* Salary Filter */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseSalary" role="button" aria-expanded="false">
            Salary
          </a>
          <div className="collapse show" id="collapseSalary">
            <div className="d-flex align-items-center">
              <input
                type="number"
                value={priceValue[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                placeholder="Min Salary"
                className="form-control me-2"
              />
              <input
                type="number"
                value={priceValue[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                placeholder="Max Salary"
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseCategory" role="button" aria-expanded="false">
            Category
          </a>
          <div className="collapse" id="collapseCategory">
            <input
              type="text"
              value={category}
              onChange={handleCategoryChange}
              placeholder="Enter Category"
              className="form-control"
            />
          </div>
        </div>

        {/* Tags Filter */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseTag" role="button" aria-expanded="false">
            Tags
          </a>
          <div className="collapse" id="collapseTag">
            <div className="form-check">
              <input
                type="checkbox"
                value="Remote"
                onChange={handleTagChange}
                className="form-check-input"
                id="tagRemote"
                checked={tags.includes("Remote")}
              />
              <label className="form-check-label" htmlFor="tagRemote">Remote</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                value="Onsite"
                onChange={handleTagChange}
                className="form-check-input"
                id="tagOnsite"
                checked={tags.includes("Onsite")}
              />
              <label className="form-check-label" htmlFor="tagOnsite">Onsite</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                value="Internship"
                onChange={handleTagChange}
                className="form-check-input"
                id="tagInternship"
                checked={tags.includes("Internship")}
              />
              <label className="form-check-label" htmlFor="tagInternship">Internship</label>
            </div>
          </div>
        </div>

        {/* Reset Filter Button */}
        <button onClick={handleReset} className="btn-ten fw-500 text-white w-100 text-center tran3s mt-30">
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default FilterArea;
