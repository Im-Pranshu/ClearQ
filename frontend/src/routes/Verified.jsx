// src/Verification.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const Verification = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const error = query.get("error");
  const message = query.get("message");

  return (
    <div>
      <h1>Verification Status</h1>
      {error ? (
        <div style={{ color: "red" }}>
          <p>{message}</p>
        </div>
      ) : (
        <div style={{ color: "green" }}>
          <p>Verification successful! You can now log in.</p>
        </div>
      )}
    </div>
  );
};

export default Verification;
