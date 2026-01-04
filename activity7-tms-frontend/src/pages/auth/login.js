import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import actlogo from "../../assets/icon/actlogo.png";
import actlogoDark from "../../assets/icon/actlogo-dark.png";
import { useTheme } from "../../hooks/useTheme";

const API_BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? actlogoDark : actlogo;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        let message = "Invalid email or password";
        try {
          const payload = await response.json();
          if (typeof payload?.message === "string") {
            message = payload.message;
          }
        } catch (error) {
          // ignore parsing errors and use default message
        }
        throw new Error(message);
      }

      const data = await response.json();

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      let resolvedDestination = '/userSide/dashboard';

      if (data?.user) {
        if (data.user.role) {
          localStorage.setItem("userRole", data.user.role);
          const normalizedRole = typeof data.user.role === 'string' ? data.user.role.toLowerCase() : '';
          resolvedDestination = normalizedRole === 'admin' ? '/adminSide/dashboard' : '/userSide/dashboard';
        }
        if (data.user.userId) {
          localStorage.setItem("userId", String(data.user.userId));
        }
        const fullName = [data.user.firstName, data.user.lastName]
          .filter(Boolean)
          .join(" ");
        if (fullName) {
          localStorage.setItem("userName", fullName);
        }
        if (data.user.email) {
          localStorage.setItem("userEmail", data.user.email);
        }
      }

      navigate(resolvedDestination, { replace: true });
    } catch (error) {
      setErrorMessage(error.message ?? "Unable to sign in. Please try again later.");
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
        <h2 className="mb-2 text-center text-base font-semibold text-slate-900 dark:text-white">
          Sign in to Access TaskRush
        </h2>
        <p className="mb-4 text-center text-sm text-slate-600 dark:text-slate-300">Welcome back! Please enter your details to continue.</p>
        <hr className="mb-6 border-slate-200 transition-colors dark:border-slate-700" />

        <form className="text-left" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 transition-colors dark:text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 transition-colors dark:text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 h-4 w-4 rounded border border-slate-300 text-indigo-600 transition-colors focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-400 dark:focus:ring-indigo-400"
              />
              <label className="text-sm text-slate-600 transition-colors dark:text-slate-300" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="./forgot-password" className="text-sm font-medium text-indigo-600 transition-colors hover:underline dark:text-indigo-300">
              Forgot password?
            </a>
          </div>
          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition-colors dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200" role="alert">
              {errorMessage}
            </div>
          )}
          <button
            className="w-full rounded-md bg-indigo-600 py-2 text-white transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="w-96 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p className="text-center">
          Don't have an account?{" "}
          <a href="./signup" className="font-medium text-indigo-600 transition-colors hover:underline dark:text-indigo-300">
            Create an Account.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;