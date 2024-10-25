'use client'
import React, { useState } from 'react';
import EmployAside from './aside';
import AdminDashboardArea from './dashboard-area';

const AdminDashboardMain = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <div className='main-page-wrapper'>
      {/* aside start */}
      <EmployAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
      {/* aside end  */}

      {/* dashboard area start */}
      <AdminDashboardArea setIsOpenSidebar={setIsOpenSidebar} />
      {/* dashboard area end */}
    </div>
  );
};

export default AdminDashboardMain;