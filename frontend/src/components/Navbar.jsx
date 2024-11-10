import React from "react";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navBar">
      <Link to="/" className="appName">
        ClearQ
      </Link>
      <div className="navMenu">
        <Link to={"/"}>Home</Link>
        <Link to={"/contact-us"}>Contact Us</Link>
        <Link to={"/about-us"}>About US</Link>
      </div>

      <div className="navBtn">
        <Link to={"/sign-in"} className="linkBtn allBtn">
          Sign in
        </Link>
        <Link to={"/sign-up"} className="linkBtn allBtn">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
