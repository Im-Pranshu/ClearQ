import React from "react";
import "../css/SignPage.css";
import { Link, Form, useActionData, useNavigation } from "react-router-dom";
import Button from "../components/Button";

import axios from "axios";

export default function ForgotPassword() {
  const actionData = useActionData(); // Capture server responses
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"; // Detect form submission state

  return (
    <div className="signUp">
      <h2>Forgot Password</h2>
      <Form method="POST">
        <input
          type="email"
          name="email"
          placeholder="Enter Email ID"
          required
        />

        <Button
          content={"Send Reset Link"}
          clickStatus={isSubmitting}
          customClasses={"logBtn"}
        />
      </Form>

      {actionData?.message && <p className="verify">{actionData.message}</p>}
      {actionData?.error && <p className="verify">{actionData.error}</p>}

      <p className="verify">
        <Link className="linkBtn" to="/sign-in">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");

    // API call to request password reset
    const response = await axios.post(
      "https://clearq-backend.onrender.com/user/requestPasswordReset",
      {
        email,
        redirectUrl: "https://clearq-frontend.onrender.com/reset-password/", // Update with your frontend URL
      }
    );

    // Return success message if status is PENDING
    if (response.data.status === "PENDING") {
      return { message: response.data.message };
    }

    // Return error message if request failed
    return { error: response.data.message || "Failed to send reset link." };
  } catch (error) {
    console.error("Error in ForgotPassword action:", error);

    if (error.response) {
      return { error: error.response.data.message || "Server error occurred." };
    }

    return { error: "An unexpected error occurred. Please try again." };
  }
}
