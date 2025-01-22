import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Importing components and routes
import Root from "./routes/Root.jsx";
import Home from "./routes/Home.jsx";
import ContactUs from "./routes/ContactUs.jsx";
import AboutUs from "./routes/AboutUs.jsx";
import SignIn, { action as signInAction } from "./routes/SignIn.jsx";
import SignUp, { action as signUpAction } from "./routes/SignUp.jsx";
import Dashboard, {
  loader as dashboardLoader,
  action as dashboardAction,
} from "./routes/Dashboard.jsx";
import VerifyEmail from "./routes/VerifyEmail.jsx";
import Verified from "./routes/Verified.jsx";
import ForgotPassword, {
  action as forgotPasswordAction,
} from "./routes/ForgetPassword.jsx";
import ResetPassword, {
  action as resetPasswordAction,
} from "./routes/ResetPassword.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import PublicRoutes from "./components/PublicRoutes.jsx";
import PendingTasks from "./routes/PendingTasks.jsx";
import CompletedTasks from "./routes/CompletedTasks.jsx";

// Defining all routes using createBrowserRouter
const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Root component for the app

    children: [
      // Public Routes: accessible to everyone
      {
        path: "/",
        element: <PublicRoutes />, // Wrapper for public routes
        children: [
          {
            index: true, // Home page (optional)
            element: <Home />, // Home route
          },
          {
            path: "/contact-us",
            element: <ContactUs />, // Contact Us page
          },
          {
            path: "/about-us",
            element: <AboutUs />, // About Us page
          },
          {
            path: "/sign-in",
            element: <SignIn />, // SignIn page
            action: signInAction, // Action for SignIn (for handling form submission)
          },
          {
            path: "/sign-up",
            element: <SignUp />, // SignUp page
            action: signUpAction, // Action for SignUp (for handling form submission)
          },
          {
            path: "/verify-email",
            element: <VerifyEmail />, // Email Verification page
          },
          {
            path: "/verified",
            element: <Verified />, // Verified page (for post-verification actions)
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />, // Forgot Password page
            action: forgotPasswordAction, // Action for forgot password
          },
          {
            path: "/reset-password/user/verify/:userId/:resetString",
            element: <ResetPassword />, // Reset Password page with dynamic userId and resetString
            action: resetPasswordAction, // Action for resetting password
          },
        ],
      },

      // Protected Routes: Only accessible if logged in
      {
        path: "/",
        element: <ProtectedRoutes />, // Wrapper for protected routes
        children: [
          {
            path: "/dashboard/:userId/",
            element: <Dashboard />, // Dashboard for the user
            loader: dashboardLoader, // Loader for fetching dashboard data
            action: dashboardAction, // Action for dashboard (like handling post requests)

            children: [
              {
                path: "pending-tasks",
                element: <PendingTasks />, // Pending tasks within the dashboard
                loader: dashboardLoader, // Loader for fetching pending tasks data
                action: dashboardAction, // Action for managing pending tasks
              },
              {
                path: "completed-tasks",
                element: <CompletedTasks />, // Completed tasks within the dashboard
                loader: dashboardLoader, // Loader for fetching completed tasks data
                action: dashboardAction, // Action for managing completed tasks
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default AppRoutes; // Export the defined routes for use in the app
