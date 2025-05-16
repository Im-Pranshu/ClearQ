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
      <FaEnvelope className="contact-icon" />
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-description">
        We’re here to help! Whether you have questions, need support, or want to
        share feedback, feel free to reach out.
      </p>
      <div className="contact-items">
        <div className="contact-item">
          <FaEnvelope className="contact-item-icon" />
          <h3>Email</h3>
          <p>
            <a href="mailto:pranshu.sharma1303@gmail.com">support@clearq.com</a>
          </p>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-item-icon" />
          <h3>Phone</h3>
          <p>
            <a href="tel:+91 7272010120">+91 7272****20</a>
          </p>
        </div>
        <div className="contact-item">
          <FaMapMarkerAlt className="contact-item-icon" />
          <h3>Address</h3>
          <p>123 ClearQ Lane, Kanpur City, UP - India</p>
        </div>
        <div className="contact-item">
          <FaHeadset className="contact-item-icon" />
          <h3>Support Hours</h3>
          <p>Mon-Fri, 9 AM - 6 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
