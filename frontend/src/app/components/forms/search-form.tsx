import React from "react";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import JobLocationSelect from "../select/job-location";
import JobCategorySelect from "../select/job-category";

const SearchForm = () => {
  const { handleSubmit, setLocationVal, setCategoryVal } =
    useSearchFormSubmit();

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-5">
          <div className="input-box">
            <div className="label">What are you looking for?</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-box border-left">
            <div className="label">Category</div>
          </div>
        </div>
        <div className="col-md-3">

        </div>
      </div>
    </form>
  );
};

export default SearchForm;
