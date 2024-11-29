import React from "react";
import { FaInfoCircle, FaLightbulb, FaCode } from "react-icons/fa";
import "../css/AboutUs.css";

const About = () => {
  return (
    <div className="about-container">
      <FaInfoCircle className="about-icon" />
      <h1 className="about-title">About ClearQ</h1>
      <p className="about-description">
        ClearQ is a cutting-edge Todo app built on the powerful MERN stack
        (MongoDB, Express, React, and Node.js). <br />
        Designed for simplicity and functionality, our app empowers users to
        plan, track, and complete their tasks with ease.
      </p>
      <div className="about-values">
        <div className="value">
          <FaLightbulb className="value-icon" />
          <h3>Our Vision</h3>
          <p>
            To inspire productivity and enable individuals to achieve their
            goals through innovative task management solutions.
          </p>
        </div>
        <div className="value">
          <FaCode className="value-icon" />
          <h3>Technology</h3>
          <p>
            We use the latest technology to ensure your experience is seamless,
            secure, and enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
