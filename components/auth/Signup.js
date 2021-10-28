import { useState } from "react";
import { useFormik } from "formik";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import validationSignupSchema from "../validation/validationSignupSchema";

export default function Signup({ login }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSignupSchema,
    onSubmit: async (values, { resetForm }) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ error: data.message || "Something went wrong!" });
        resetForm();
      } else if (response.ok) {
        resetForm();
        // TODO send data.message to user
        setMessage({ success: "User Created!" });
        // login();
        const login = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        if (!login.error) {
          router.replace("/portal");
        } else {
          setError(response.error);
        }
        return data;
      }
    },
  });

  let errorsFormik = Object.keys(formik.errors);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or
            <a
              href="#"
              onClick={() => login()}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              &nbsp;Sign-In Your account
            </a>
          </p>
        </div>

        {message && (
          <>
            <div className="text-red-600 text-center bg-gray-100">
              {message.error}
            </div>
            <div className="text-green-600 text-center bg-gray-100">
              {message.success}
            </div>
          </>
        )}
        {errorsFormik.map((err) => (
          <span
            className="text-red-600 text-center bg-gray-100 text-xs block"
            key={err}
          >
            {formik.touched[err] && formik.errors[err]}
          </span>
        ))}
        <form
          className="mt-8 space-y-6"
          onSubmit={formik.handleSubmit}
          method="POST"
        >
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Your Name
              </label>
              <input
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                value={formik.values.email}
                onChange={formik.handleChange}
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="verifypassword" className="sr-only">
                Re-type Password
              </label>
              <input
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Re-type Password"
              />
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-white group-hover:text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
