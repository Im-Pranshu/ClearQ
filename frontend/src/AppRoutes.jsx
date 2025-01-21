import React from "react";
import { createBrowserRouter } from "react-router-dom";

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

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

    children: [
      // Public Routes
      {
        path: "/",
        element: <PublicRoutes />, // Wrapper for public routes
        children: [
          {
            index: true, // Home page (optional)
            element: <Home />,
          },
          {
            path: "/contact-us",
            element: <ContactUs />,
          },
          {
            path: "/about-us",
            element: <AboutUs />,
          },
          {
            path: "/sign-in",
            element: <SignIn />,
            action: signInAction,
          },
          {
            path: "/sign-up",
            element: <SignUp />,
            action: signUpAction,
          },
          {
            path: "/verify-email",
            element: <VerifyEmail />,
          },
          {
            path: "/verified",
            element: <Verified />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />,
            action: forgotPasswordAction,
          },
          {
            path: "/reset-password/user/verify/:userId/:resetString",
            element: <ResetPassword />,
            action: resetPasswordAction,
          },
        ],
      },

      // Protected Routes Wrapper
      {
        path: "/",
        element: <ProtectedRoutes />, // Only accessible if logged in
        children: [
          {
            path: "/dashboard/:userId/",
            element: <Dashboard />,
            loader: dashboardLoader,
            action: dashboardAction,

            children: [
              {
                path: "pending-tasks",
                element: <PendingTasks />,
                loader: dashboardLoader,
                action: dashboardAction,
              },
              {
                path: "completed-tasks",
                element: <CompletedTasks />,
                loader: dashboardLoader,
                action: dashboardAction,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default AppRoutes;
