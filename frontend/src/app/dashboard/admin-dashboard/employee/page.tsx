'use client'
import React,{useState} from 'react';
import Wrapper from '@/layouts/wrapper';
import AdminAside from '@/app/components/dashboard/admin/aside';
import AdminJobArea from '@/app/components/dashboard/admin/job-area';

const AdminDashboardJobsPage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>

    <div className='main-page-wrapper'>
      {/* aside start */}
      <AdminAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar}/>
      {/* aside end  */}

      {/* job area start */}
      <AdminJobArea setIsOpenSidebar={setIsOpenSidebar}/>
      {/* job area end */}
    </div>
    </Wrapper>
  );
};

export default AdminDashboardJobsPage;