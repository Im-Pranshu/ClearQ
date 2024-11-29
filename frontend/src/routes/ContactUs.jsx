import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHeadset,
} from "react-icons/fa";
import "../css/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-description">
        We’re here to help! Whether you have questions, need support, or want to
        share feedback, feel free to reach out.
      </p>
      <div className="contact-info">
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <p>
            Email: <a href="mailto:support@clearq.com">support@clearq.com</a>
          </p>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <p>
            Phone: <a href="tel:+1234567890">+1 234 567 890</a>
          </p>
        </div>
        <div className="contact-item">
          <FaMapMarkerAlt className="contact-icon" />
          <p>Address: 123 ClearQ Lane, Productivity City, PQ 12345</p>
        </div>
        <div className="contact-item">
          <FaHeadset className="contact-icon" />
          <p>Support Hours: Mon-Fri, 9 AM - 6 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
