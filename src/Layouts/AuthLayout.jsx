import React from "react";
import { Outlet } from "react-router"; // corrected import path
import authImage from "../assets/authImage.png";
import Logo from "../Pages/Shared/Logo/Logo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left: Form Section */}
      <div className="flex flex-col justify-start lg:justify-center px-6 md:px-12 py-6 lg:py-10">
        <div className="absolute top-6 mt-2">
          <Logo />
        </div>
        <div className="w-full max-w-md mx-auto mt-24 lg:mt-0">
          <Outlet />
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-[#f5fbe7]">
        <img
          src={authImage}
          alt="Auth Illustration"
          className="max-w-sm w-full"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
