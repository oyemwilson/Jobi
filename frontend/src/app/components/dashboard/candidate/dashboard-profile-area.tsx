"use client"
import React from 'react';
import Image from 'next/image';
import avatar from '@/assets/dashboard/images/avatar_02.jpg';
import search from '@/assets/dashboard/images/icon/icon_16.svg';
import DashboardHeader from './dashboard-header';
import CountrySelect from './country-select';
import CitySelect from './city-select';
import StateSelect from './state-select';

// props type 
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}
const DashboardProfileArea = ({setIsOpenSidebar}:IProps) => {
  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

        <h2 className="main-title">My Profile</h2>

        <div className="bg-white card-box border-20">
          {/* <div className="user-avatar-setting d-flex align-items-center mb-30">
            <Image src={avatar} alt="avatar" className="lazy-img user-img" />
            <div className="upload-btn position-relative tran3s ms-4 me-3">
              Upload new photo
              <input type="file" id="uploadImg" name="uploadImg" placeholder="" />
            </div>
            <button className="delete-btn tran3s">Delete</button>
          </div> */}
          {/* <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Full Name*</label>
            <input type="text" placeholder="Md James Brower" />
          </div> */}
          <div className="dash-input-wrapper">
            <label htmlFor="">Bio*</label>
            <textarea className="size-lg" placeholder="Write something interesting about you...."></textarea>
            <div className="alert-text">Brief description for your profile. URLs are hyperlinked.</div>
          </div>
        </div>

        {/* <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Social Media</h4>

          <div className="dash-input-wrapper mb-20">
            <label htmlFor="">Network 1</label>
            <input type="text" placeholder="#" />
          </div>
          <div className="dash-input-wrapper mb-20">
            <label htmlFor="">Network 2</label>
            <input type="text" placeholder="#" />
          </div>
          <a href="#" className="dash-btn-one"><i className="bi bi-plus"></i> Add more link</a>
        </div> */}

        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Address & Location</h4>
          <div className="row">
            <div className="col-12">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Address*</label>
                <input type="text" placeholder="Cowrasta, Chandana, Gazipur Sadar" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Country*</label>
                <CountrySelect/>
              </div>
            </div>
            {/* <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">City*</label> 
                <CitySelect/>
              </div> */}
            {/* </div> */}
            {/* <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Zip Code*</label>
                <input type="number" placeholder="1708" />
              </div>
            </div> */}
            <div className="col-lg-6">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">State*</label>
                <input type="text" />
              </div>
            </div>
          </div>
        </div>

        <div className="button-group d-inline-flex align-items-center mt-30">
          <a href="#" className="dash-btn-two tran3s me-3">Save</a>
          <a href="#" className="dash-cancel-btn tran3s">Cancel</a>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileArea;