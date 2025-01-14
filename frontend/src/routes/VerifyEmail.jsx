import React from "react";
import { Link } from "react-router-dom";
import rocket from "../assets/rocket.png";

const VerifyEmail = () => {
  return (
    <div className="signUp otp">
      <img src={rocket} alt="rocekt logo" />
      <h2>Verify Email Id</h2>
      <p>We have sent a verification link to your email.</p>
      <p
        style={{
          fontSize: "12px",
          marginTop: "0px",
          color: "grey",
          textAlign: "start",
        }}
      >
        (If not found in inbox then check your spam folder.)
      </p>
      <Link
        className="allBtn linkBtn verify"
        to="https://www.gmail.com"
        target="_blank"
      >
        Check Inbox
      </Link>
    </div>
  );
};

export default VerifyEmail;
