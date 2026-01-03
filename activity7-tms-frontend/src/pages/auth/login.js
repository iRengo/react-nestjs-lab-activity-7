import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import actlogo from "../../assets/icon/actlogo.png";

const API_BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (data?.user) {
        if (data.user.role) {
          localStorage.setItem("userRole", data.user.role);
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

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message ?? "Unable to sign in. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen ">
      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-8 rounded-lg shadow-sm">
        <img
          src={actlogo}
          alt="Logo"
          className="mx-auto mb-4 w-20 h-20 border rounded-full border-[#D1D9E0] bg-white"
        />
        <h2 className="text-base font-semibold mb-6 text-center">
          Sign in to Access TaskRush
        </h2>
        <hr className=" bg-[#D1D9E0] mb-6" />

        <form className="text-left" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label className="text-sm" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="./forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {errorMessage}
            </div>
          )}
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-md transition duration-200 hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="./signup" className="text-blue-500 hover:underline">
            Create an Account.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;