import React, { useState, useEffect } from "react";
import "../css/Root.css";
import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially, it's null because we're loading the login state
  const navigate = useNavigate();
  // This will run once when the component mounts
  useEffect(() => {
    // Check the login state in localStorage
    const loginStatus = window.localStorage.getItem("isLoggedIn");

    // If the user is logged in, we update the state
    if (loginStatus === "true") {
      setIsLoggedIn(true);
      navigate("/dashboard");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // If login state is null (still loading), show the loader
  if (isLoggedIn === null) {
    return <div className="loader"></div>;
  }

  return (
    <div className="Root">
      <div>
        <Navbar />
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
