import React from "react";
import "../css/Navbar.css";
import { Link, Navigate } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  const logout = () => {
    window.localStorage.setItem("isLoggedIn", "false");
    Navigate("/sign-in");
  };

  return (
    <nav className="navBar">
      <Link to="/" className="appName">
        ClearQ
      </Link>

      {isLoggedIn === "false" && (
        <div className="navMenu">
          <Link to={"/"}>Home</Link>
          <Link to={"/contact-us"}>Contact Us</Link>
          <Link to={"/about-us"}>About US</Link>
        </div>
      )}

      {isLoggedIn === "false" && (
        <div className="navBtn">
          <Link to={"/sign-in"} className="linkBtn allBtn">
            Sign in
          </Link>
          <Link to={"/sign-up"} className="linkBtn allBtn">
            Sign up
          </Link>
        </div>
      )}

      {isLoggedIn === "true" && (
        <div className="navBtn">
          <Link onClick={logout} className="linkBtn allBtn" to={"/sign-in"}>
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
