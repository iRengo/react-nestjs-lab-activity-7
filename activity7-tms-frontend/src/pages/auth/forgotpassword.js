import React from "react";
import actlogo from "../../assets/icon/actlogo.png";
import actlogoDark from "../../assets/icon/actlogo-dark.png";
import { useTheme } from "../../hooks/useTheme";

const ForgotPassword = () => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? actlogoDark : actlogo;
  const inputClasses =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400";

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 transition-colors dark:bg-slate-950">
      <div className="w-96 rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <img
          src={logoSrc}
          alt="Logo"
          className="mx-auto mb-4 h-20 w-20 rounded-full border border-slate-200 bg-white p-2 transition-colors dark:border-slate-700 dark:bg-slate-950"
        />
        <h2 className="mb-2 text-center text-base font-semibold text-slate-900 transition-colors dark:text-white">
          Forgot Your Password?
        </h2>
        <p className="mb-4 text-center text-sm text-slate-600 transition-colors dark:text-slate-300">
          Enter your details below and we will help you restore access.
        </p>
        <hr className="mb-6 border-slate-200 transition-colors dark:border-slate-700" />

        <form className="text-left">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 transition-colors dark:text-slate-200" htmlFor="email">
              Email
            </label>
            <input className={inputClasses} type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 transition-colors dark:text-slate-200" htmlFor="newpassword">
              New Password
            </label>
            <input className={inputClasses} type="password" id="newpassword" placeholder="Enter your password" />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 transition-colors dark:text-slate-200" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input className={inputClasses} type="password" id="confirmPassword" placeholder="Confirm your password" />
          </div>
       {/*}
          <div
            className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md mb-2 hidden"
            id="error-message"
          >
            error message
          </div>
       */}

          <button
            className="w-full rounded-md bg-indigo-600 py-2 text-white transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400"
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>

      <div className="w-96 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p className="text-center">
          Remember your password?{" "}
          <a href="./login" className="font-medium text-indigo-600 transition-colors hover:underline dark:text-indigo-300">
            Login.
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;