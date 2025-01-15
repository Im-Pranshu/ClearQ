import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  return isLoggedIn === "true" ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoutes;
