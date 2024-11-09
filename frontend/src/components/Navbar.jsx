import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navBar">
      <Link to="/" className="appName linkBtn">
        ClearQ
      </Link>
      <div className="navMenu">
        <Link to={"/"} className="linkBtn">
          Home
        </Link>
        <Link to={"/contact-us"} className="linkBtn">
          Contact Us
        </Link>
        <Link to={"/about-us"} className="linkBtn">
          About US
        </Link>
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
