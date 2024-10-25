"use client";
import React, { useState } from "react";
import Image from "next/image";
import RegisterForm from "../forms/register-form";
import google from "@/assets/images/icon/google.png";
import facebook from "@/assets/images/icon/facebook.png";
import { useRouter } from "next/navigation";

const RegisterArea: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("applicant"); // Default role to applicant
  const [roleSelected, setRoleSelected] = useState<boolean>(false); // State to track if role is selected
  const router = useRouter();

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setRoleSelected(true); // Set roleSelected to true when a role is selected
  };

  const handleSignInClick = () => {
    // Navigate to sign-in modal or page
    router.push("/signin");
  };

  return (
    <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="user-data-form">
          <div className="text-center">
            <h2>Create Account</h2>
          </div>
          <div className="form-wrapper m-auto">
            <ul className="nav nav-tabs border-0 w-100 mt-30" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${selectedRole === "applicant" ? "active" : ""}`}
                  onClick={() => handleRoleChange("applicant")}
                  aria-selected={selectedRole === "applicant"}
                  tabIndex={-1}
                >
                  Applicant
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${selectedRole === "employer" ? "active" : ""}`}
                  onClick={() => handleRoleChange("employer")}
                  aria-selected={selectedRole === "employer"}
                  tabIndex={-1}
                >
                  Employer
                </button>
              </li>
            </ul>
            <div className="tab-content mt-40">
              <div className="tab-pane fade show active" role="tabpanel" id="fc1">
                <RegisterForm selectedRole={selectedRole} handleRoleChange={handleRoleChange} />
              </div>
              <div className="tab-pane fade" role="tabpanel" id="fc2">
                <RegisterForm selectedRole={selectedRole} handleRoleChange={handleRoleChange} />
              </div>
            </div>

            <div className="d-flex align-items-center mt-30 mb-10">
              <div className="line"></div>
              <span className="pe-3 ps-3">OR</span>
              <div className="line"></div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <a
                  href="#"
                  className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                >
                  <Image src={google} alt="Sign up with Google" />
                  <span className="ps-2">Signup with Google</span>
                </a>
              </div>
              <div className="col-sm-6">
                <a
                  href="#"
                  className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                >
                  <Image src={facebook} alt="Sign up with Facebook" />
                  <span className="ps-2">Signup with Facebook</span>
                </a>
              </div>
            </div>
            <p className="text-center mt-10">
              Have an account?{" "}
              <a
                href="#"
                className="fw-500"
                onClick={handleSignInClick}
              >
                Sign In
              </a>
            </p>
            {!roleSelected && (
              <div className="text-center mt-3">
                <span className="text-danger">Please select a role to proceed.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterArea;
