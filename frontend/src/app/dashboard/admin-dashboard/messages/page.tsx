'use client'
import React,{useState} from 'react';
import Wrapper from '@/layouts/wrapper';
import AdminAside from '@/app/components/dashboard/admin/aside';
import DashboardMessage from '@/app/components/dashboard/admin/dashboard-message';

const AdminDashboardMessagesPage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>

    <div className='main-page-wrapper'>
      {/* aside start */}
      <AdminAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar}/>
      {/* aside end  */}

      {/* messages area start */}
      <DashboardMessage setIsOpenSidebar={setIsOpenSidebar}/>
      {/* messages area end */}
    </div>
    </Wrapper>
  );
};

export default AdminDashboardMessagesPage;