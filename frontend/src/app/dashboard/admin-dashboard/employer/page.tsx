'use client'
import React,{useState} from 'react';
import Wrapper from '@/layouts/wrapper';
import AdminAside from '@/app/components/dashboard/admin/aside';
import EmployProfileArea from '@/app/components/dashboard/admin/profile-area';

const EmployDashboardProfilePage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>

    <div className='main-page-wrapper'>
      {/* aside start */}
      <AdminAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar}/>
      {/* aside end  */}

      {/* profile area start */}
      <EmployProfileArea setIsOpenSidebar={setIsOpenSidebar}/>
      {/* profile area end */}
    </div>
    </Wrapper>
  );
};

export default EmployDashboardProfilePage;