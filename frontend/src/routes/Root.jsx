import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Dashboard from "../routes/Dashboard";
import { Outlet } from "react-router-dom";

import axios from "axios";

const Root = () => {
  // FETCHING DATA BY AXIOS
  const [data, setData] = useState();
  const getData = async () => {
    const response = await axios.get("http://localhost:5000/getData");
    setData(response.data);
  };
  // fetching done

  useEffect(() => {
    // fetching data from backend as soon as page loads.
    getData();
  }, []);

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
