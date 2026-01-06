import React, { useState } from "react";
import actlogo from "../../assets/icon/actlogo.png";
import actlogoDark from "../../assets/icon/actlogo-dark.png";
import { useTheme } from "../../hooks/useTheme";

const API_BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

const ForgotPassword = () => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? actlogoDark : actlogo;
  const inputClasses =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400";
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setErrorMessage("Please enter the email associated with your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = typeof payload?.message === "string" ? payload.message : "Unable to reset password.";
        throw new Error(message);
      }

      setSuccessMessage(
        typeof payload?.message === "string"
          ? payload.message
          : "If your email is registered, a temporary password has been sent to your inbox."
      );
      setEmail("");
    } catch (error) {
      setErrorMessage(error.message ?? "Unable to reset password. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Enter your email and we will send you a temporary password.
        </p>
        <hr className="mb-6 border-slate-200 transition-colors dark:border-slate-700" />

        <form className="text-left" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 transition-colors dark:text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              className={inputClasses}
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {errorMessage ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition-colors dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200" role="alert">
              {errorMessage}
            </div>
          ) : null}
          {successMessage ? (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 transition-colors dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200" role="status">
              {successMessage}
            </div>
          ) : null}
          <button
            className="w-full rounded-md bg-indigo-600 py-2 text-white transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Email"}
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