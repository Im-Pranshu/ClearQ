import React, { useEffect } from "react";
import { FaTasks, FaCheckCircle, FaRegListAlt } from "react-icons/fa";
import "../css/Home.css";

const Home = () => {
  // Check if the user is logged in when the component mounts
  // If not, set the login state to false and reload the page
  useEffect(() => {
    if (window.localStorage.getItem("isLoggedIn") === null) {
      window.localStorage.setItem("isLoggedIn", "false");
      window.location.reload();
    }
  }, []);

  return (
    <div className="home-container">
      <FaTasks className="home-icon" />
      {/* <img src={logo} className="home-icon"></img> */}
      <h1 className="home-title">Welcome to ClearQ</h1>
      <p className="home-description">
        Take control of your tasks with ClearQ.
        <br />
        the ultimate to-do app designed for productivity enthusiasts.
        <br />
        Whether you’re managing daily errands or complex projects, ClearQ helps
        you stay organized and efficient.
      </p>
      <div className="home-features">
        <div className="feature">
          <FaCheckCircle className="feature-icon" />
          <h3>Streamlined Task Management</h3>
          <p>
            Organize your to-do lists effortlessly with intuitive drag-and-drop
            functionality.
          </p>
        </div>
        <div className="feature">
          <FaRegListAlt className="feature-icon" />
          <h3>Customizable Lists</h3>
          <p>
            Create, customize, and categorize your tasks to match your unique
            workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
