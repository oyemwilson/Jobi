'use client'
import React,{useState} from 'react';
import Wrapper from "@/layouts/wrapper";
import AdminAside from '@/app/components/dashboard/admin/aside';
import SavedCandidateArea from "@/app/components/dashboard/employ/saved-candidate-area";

const EmployDashboardSavedCandidatePage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* aside start */}
        <AdminAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
        {/* aside end  */}

        {/* saved candidate area start */}
        <SavedCandidateArea setIsOpenSidebar={setIsOpenSidebar} />
        {/* saved candidate area end */}
      </div>
    </Wrapper>
  );
};

export default EmployDashboardSavedCandidatePage;
