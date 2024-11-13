import React, { useState, useEffect } from "react";
import "../css/Root.css";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const Root = () => {
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
