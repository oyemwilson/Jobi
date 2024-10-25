'use client'
import React, { useState } from "react";
import Wrapper from "@/layouts/wrapper";
import AdminAside from "@/app/components/dashboard/admin/aside";
import SubmitJobArea from "@/app/components/dashboard/admin/submit-job-area";

const AdminDashboardSubmitJobPage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* aside start */}
        <AdminAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
        {/* aside end  */}

        {/* submit job area start */}
        <SubmitJobArea setIsOpenSidebar={setIsOpenSidebar} />
        {/* submit job area end */}
      </div>
    </Wrapper>
  );
};

export default AdminDashboardSubmitJobPage;
