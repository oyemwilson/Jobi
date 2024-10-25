import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import axios from 'axios';
import { useRouter } from "next/navigation";

// Form data type
type IFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp: string; // Optional, used in step 2
  role: string; // Optional, used to pass role
};

// Validation schema
const schema = Yup.object().shape({
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

// Resolver function
const resolver: Resolver<IFormData> = async (values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return {
      values: values.firstName && values.lastName ? values : {},
      errors: {},
    };
  } catch (errors) {
    return {
      values: {},
      errors: errors.inner.reduce((allErrors, currentError) => {
        return {
          ...allErrors,
          [currentError.path!]: {
            type: currentError.type ?? "validation",
            message: currentError.message ?? "Validation error.",
          },
        };
      }, {}),
    };
  }
};

const RegisterForm = ({ selectedRole, handleRoleChange }) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // Step to track registration progress
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>({
    resolver,
    defaultValues: {
      role: selectedRole // Set default value for role based on selectedRole
    }
  });
  const router = useRouter();

  useEffect(() => {
    // Reset form when selectedRole changes
    reset({
      role: selectedRole
    });
    setStep(1); // Reset step to 1 when role changes
  }, [selectedRole, reset]);

  const onSubmit = async (data: IFormData) => {
    try {
      if (step === 1) {
        // Step 1: Send a request for OTP
        const otpResponse = await axios.post('http://localhost:5001/api/send-otp', { email: data.email });
        if (otpResponse.status === 200) {
          // Move to step 2 (OTP submission)
          setStep(2);
          return;
        }
      } else if (step === 2) {
        // Step 2: OTP submission and final registration
        const registrationData = { ...data, otp: data.otp, role: data.role };
        const response = await axios.post('http://localhost:5001/api/users', registrationData);
        console.log('Response from backend:', response);
        
        // Handle the response
        if (response.status === 201) {
          reset(); // Reset the form
          router.push("/"); // Redirect to the home page
        } else {
          
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while registering. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Step 1: Name, Email, Password */}
        {step === 1 && (
          <>
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>First Name*</label>
                <input
                  type="text"
                  placeholder="James"
                  {...register("firstName", { required: "First Name is required!" })}
                  name="firstName"
                />
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.firstName?.message!} />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Last Name*</label>
                <input
                  type="text"
                  placeholder="Brower"
                  {...register("lastName", { required: "Last Name is required!" })}
                  name="lastName"
                />
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.lastName?.message!} />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Email*</label>
                <input
                  type="email"
                  placeholder="james@example.com"
                  {...register("email", { required: "Email is required!" })}
                  name="email"
                />
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.email?.message!} />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="input-group-meta position-relative mb-20">
                <label>Password*</label>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter Password"
                  className="pass_log_id"
                  {...register("password", { required: "Password is required!" })}
                  name="password"
                />
                <span
                  className="placeholder_icon"
                  onClick={() => setShowPass(!showPass)}
                >
                  <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                    <Image src={icon} alt="pass-icon" />
                  </span>
                </span>
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.password?.message!} />
                </div>
              </div>
            </div>
          </>
        )}
        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="col-12">
            <div className="input-group-meta position-relative mb-20">
              <label>OTP*</label>
              <input
                type="text"
                placeholder="Enter OTP"
                {...register("otp", { required: "OTP is required!" })}
                name="otp"
              />
              <div className="help-block with-errors">
                <ErrorMsg msg={errors.otp?.message!} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="col-12">
        <button type="submit" className="btn-eleven fw-500 tran3s d-block mt-20">
          {step === 1 ? 'Request OTP' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
