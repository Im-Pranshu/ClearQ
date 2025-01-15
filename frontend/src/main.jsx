import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";

// Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/Root.jsx";
import Home from "./routes/Home.jsx";
import ContactUs from "./routes/ContactUs.jsx";
import AboutUs from "./routes/AboutUs.jsx";
import SignIn, { action as signInAction } from "./routes/SignIn.jsx";
import SignUp, { action as signUpAction } from "./routes/SignUp.jsx";
import Dashboard from "./routes/Dashboard.jsx";
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

const router = createBrowserRouter([
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
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// {
//   index: true, // This renders the Index component at the root path
//   element: <Home />,
// },
// {
//   path: "/sign-in",
//   element: <SignIn />,
//   action: signInAction,
// },
// {
//   path: "/sign-up",
//   element: <SignUp />,
//   action: signUpAction,
// },
// {
//   path: "/verify-email",
//   element: <VerifyEmail />,
// },
// {
//   path: "/verified",
//   element: <Verified />,
// },
// {
//   path: "/forgot-password",
//   element: <ForgotPassword />,
//   action: forgotPasswordAction,
// },
// {
//   path: "/reset-password/user/verify/:userId/:resetString",
//   element: <ResetPassword />,
//   action: resetPasswordAction,
// },
// {
//   path: "/contact-us",
//   element: <ContactUs />,
// },
// {
//   path: "/about-us",
//   element: <AboutUs />,
// },
