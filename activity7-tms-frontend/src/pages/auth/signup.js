import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import actlogo from "../../assets/icon/actlogo.png";

const API_BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";
const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const initialFormState = {
  memberId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [idStatus, setIdStatus] = useState({ type: "", message: "" });
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const lastSuccessfulIdRef = useRef("");
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  const redirectTimerRef = useRef(null);
  const navigate = useNavigate();

  const resetMemberDetails = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
    }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      if (name === "memberId") {
        return {
          ...prev,
          memberId: value,
          ...(value.trim() === prev.memberId.trim()
            ? {}
            : { firstName: "", lastName: "", email: "" }),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    if (name === "memberId") {
      setIdStatus({ type: "", message: "" });
    }
    setSubmitStatus({ type: "", message: "" });
  }, []);

  useEffect(() => {
    const rawId = formData.memberId.trim();

    if (!rawId) {
      lastSuccessfulIdRef.current = "";
      resetMemberDetails();
      setIsCheckingId(false);
      setIdStatus({ type: "", message: "" });
      setHasExistingAccount(false);
      return;
    }

    let isCancelled = false;

    const timeoutId = setTimeout(async () => {
      if (isCancelled) {
        return;
      }

      if (!/^\d+$/.test(rawId)) {
        lastSuccessfulIdRef.current = "";
        resetMemberDetails();
        setIsCheckingId(false);
        setHasExistingAccount(false);
        setIdStatus({ type: "error", message: "ID must be a numeric value." });
        return;
      }

      if (lastSuccessfulIdRef.current === rawId) {
        return;
      }

      setIsCheckingId(true);

      try {
        const response = await fetch(`${API_BASE_URL}/members/${rawId}`);

        if (isCancelled) {
          return;
        }

        if (!response.ok) {
          lastSuccessfulIdRef.current = "";
          resetMemberDetails();
          setHasExistingAccount(false);

          if (response.status === 404) {
            setIdStatus({ type: "error", message: "No matching member found for this ID." });
          } else {
            setIdStatus({ type: "error", message: "Unable to verify ID. Please try again." });
          }

          return;
        }

        const member = await response.json();
        if (isCancelled) {
          return;
        }

        lastSuccessfulIdRef.current = rawId;
        setFormData((prev) => ({
          ...prev,
          firstName: member?.firstName ?? "",
          lastName: member?.lastName ?? "",
          email: member?.email ?? "",
        }));
        const accountResponse = await fetch(`${API_BASE_URL}/users/${rawId}`);
        const accountExists = accountResponse.ok;
        setHasExistingAccount(accountExists);
        setIdStatus({
          type: accountExists ? "error" : "success",
          message: accountExists
            ? "An account already exists for this ID."
            : "Member details found !",
        });
      } catch (error) {
        if (!isCancelled) {
          lastSuccessfulIdRef.current = "";
          resetMemberDetails();
          setHasExistingAccount(false);
          setIdStatus({ type: "error", message: "Unable to verify ID. Please check your connection." });
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingId(false);
        }
      }
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [formData.memberId, resetMemberDetails]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      setSubmitStatus({ type: "", message: "" });

      const memberIdRaw = formData.memberId.trim();

      if (!memberIdRaw) {
        setSubmitStatus({ type: "error", message: "Member ID is required." });
        return;
      }

      if (memberIdRaw !== lastSuccessfulIdRef.current) {
        setSubmitStatus({
          type: "error",
          message: "Please verify your ID before submitting the form.",
        });
        return;
      }

      if (hasExistingAccount) {
        setSubmitStatus({ type: "error", message: "Account already exists for this ID." });
        return;
      }

      if (!formData.firstName || !formData.lastName || !formData.email) {
        setSubmitStatus({
          type: "error",
          message: "Member details could not be loaded. Try validating the ID again.",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setSubmitStatus({ type: "error", message: "Passwords do not match." });
        return;
      }

      if (!PASSWORD_POLICY.test(formData.password)) {
        setSubmitStatus({
          type: "error",
          message: "Password must be at least 8 characters and include uppercase, lowercase, and a digit.",
        });
        return;
      }

      const memberIdValue = Number(memberIdRaw);
      if (!Number.isInteger(memberIdValue)) {
        setSubmitStatus({ type: "error", message: "Member ID must be a numeric value." });
        return;
      }

      setIsSubmitting(true);

      const payload = {
        userId: memberIdValue,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "user",
        status: "active",
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const message = errorBody?.message || "Unable to create account.";
          throw new Error(Array.isArray(message) ? message.join(" ") : message);
        }

        setSubmitStatus({
          type: "success",
          message: "Account created successfully. Redirecting to login...",
        });
        setFormData(initialFormState);
        lastSuccessfulIdRef.current = "";
        setIdStatus({ type: "", message: "" });
        redirectTimerRef.current = window.setTimeout(() => navigate("/login"), 1500);
      } catch (error) {
        setSubmitStatus({ type: "error", message: error.message || "Unable to create account." });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, hasExistingAccount, navigate],
  );

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

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

        <form className="text-left" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="memberId">
              ID <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="memberId"
              name="memberId"
              placeholder="Enter your ID"
              value={formData.memberId}
              onChange={handleChange}
              aria-describedby="memberId-feedback"
            />
            {isCheckingId && (
              <div className="mt-2 flex items-center text-xs text-slate-500" id="memberId-feedback">
                <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                Searching member record...
              </div>
            )}
            {!isCheckingId && idStatus.message && (
              <p
                className={`mt-2 text-xs ${
                  idStatus.type === "success" ? "text-green-600" : "text-red-600"
                }`}
                id="memberId-feedback"
              >
                {idStatus.message}
              </p>
            )}
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {submitStatus.message && (
            <p
              className={`mb-3 text-sm ${
                submitStatus.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {submitStatus.message}
            </p>
          )}
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-800 transition duration-200 disabled:cursor-not-allowed disabled:bg-indigo-300"
            type="submit"
            disabled={
              isCheckingId ||
              isSubmitting ||
              !formData.memberId.trim() ||
              lastSuccessfulIdRef.current !== formData.memberId.trim() ||
              hasExistingAccount
            }
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
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