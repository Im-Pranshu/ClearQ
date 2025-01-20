import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoutes = () => {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  // Redirect logged-in users to the dashboard or a protected route
  return isLoggedIn === "true" ? (
    <Navigate to={"/dashboard/" + window.localStorage.getItem("userId")} />
  ) : (
    <Outlet />
  );
};

export default PublicRoutes;
