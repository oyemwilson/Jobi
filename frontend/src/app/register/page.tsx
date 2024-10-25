'use client'
import React, { useEffect } from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import RegisterArea from "../components/register/register-area";

// export const metadata: Metadata = {
//   title: "Register",
// };

const RegisterPage = () => {

    // Remove modal backdrop
    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.remove();
    }
  
    // Ensure body overflow is not hidden
    document.body.style.overflow = 'auto'; // Enable scrolling
    
    // Remove modal-open class that Bootstrap adds to body to prevent scrolling
    document.body.classList.remove('modal-open');
  
  
    

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/*breadcrumb start */}
        <CompanyBreadcrumb
          title="Register"
          subtitle="Create an account & Start posting or hiring talents"
        />
        {/*breadcrumb end */}

        {/* register area start */}
        <RegisterArea/>
        {/* register area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default RegisterPage;
