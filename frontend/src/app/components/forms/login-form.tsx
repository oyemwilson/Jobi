"use client";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { login } from '@/redux/features/authSlice'; // Import login action from your auth slice


// form data type
type IFormData = {
  email: string;
  password: string;
};

// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
          email: {
            type: "required",
            message: "Email is required.",
          },
          password: {
            type: "required",
            message: "Password is required.",
          },
        }
      : {},
  };
};

const LoginForm = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const dispatch = useDispatch(); // Get dispatch function from react-redux
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({ resolver });

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      dispatch(login(userData));
    }
  }, [dispatch]);
  // on submit
  // onSubmit function
  const onSubmit = async (data: IFormData) => {
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", data);
      console.log("Response from backend:", response.data)
      if (response.data && response.data.token) {
        setLoginSuccessful(true);
        setErrorMessage(null);
        const userData = {
          token: response.data.token,
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          appliedJobs: response.data.jobs,
          email: response.data.email || "",
          _id: response.data._id || "",
          isAdmin: response.data.isAdmin || false,
          role: response.data.role || "",
          user: response.data.user || null,
          fileId: response.data.filed,
          
        };
        
  
        // Store user data, including the username, in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log("userData stored in localStorage:", localStorage.getItem('userData')); // Log localStorage
  
        dispatch(login(userData));
        

      // Redirect logic after successful login
      const userRole = response.data.role;
      switch (userRole) {
        case "applicant":
          router.push("/dashboard/candidate-dashboard");
          break;
        case "admin":
          router.push("/dashboard/admin-dashboard");
          break;
        case "employer":
          router.push("/dashboard/employ-dashboard");
          break;
        default:
          alert("Unknown user role");
          break;
      }
    } else {
      setLoginSuccessful(false);
      setErrorMessage('Invalid username or password')
    }
  } catch (error) {
    setLoginSuccessful(false);
    console.error('An error occurred:', error);
    setErrorMessage('Invalid username or password')
  }
};

  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="james@example.com"
              {...register("email", { required: `Email is required!` })}
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
              type={`${showPass ? "text" : "password"}`}
              placeholder="Enter Password"
              className="pass_log_id"
              {...register("password", { required: `Password is required!` })}
              name="password"
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPass(!showPass)}
            >
              <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                <Image src={icon} alt="icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.password?.message!} />
              {errorMessage && (
                <p className="error-message" style={{ color: 'red', fontStyle: 'italic' }}>{errorMessage}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Keep me logged in</label>
            </div>
            <a href="#">Forget Password?</a>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn-eleven fw-500 tran3s d-block mt-20"
            // data-bs-dismiss = 'modal'
            // aria-label = 'Close'
            {...(loginSuccessful && { 'data-bs-dismiss': 'modal', 'aria-label': 'Close' })}
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
