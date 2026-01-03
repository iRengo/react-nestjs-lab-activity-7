import React from "react";
import actlogo from "../../assets/icon/actlogo.png";

const Signup = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-8 rounded-lg shadow-sm">
        <img
          src={actlogo}
          alt="Logo"
          className="mx-auto mb-4 w-20 h-20 border rounded-full border-[#D1D9E0] bg-white"
        />
        <h2 className="text-base font-semibold text-center">
          Create Your Account
        </h2>
        <p className="text-xs mb-6 text-center">
          Join the TaskRush Now ! 
        </p>
        <hr className=" bg-[#D1D9E0] mb-6" />

        <form className="text-left">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              ID <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="userId"
              placeholder="Enter your ID"
            />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="firstName"
                placeholder="Enter your first name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="lastName"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
              />
            </div>
          </div>

            {/*
          <div
            className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md -mt-4 mb-2 "
            id="error-message"
          >
            error message
          </div>
          */}
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-800 transition duration-200"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>

      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="./login" className="text-blue-500 hover:underline">
            Sign In.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;