import React from "react";
import "../css/SignPage.css";
import {
  Form,
  useActionData,
  useNavigation,
  useParams,
} from "react-router-dom";
import Button from "../components/Button";

import axios from "axios";

export default function ResetPassword() {
  const actionData = useActionData(); // Capture server responses
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"; // Detect form submission state
  const { userId, resetString } = useParams(); // Extract parameters from URL

  return (
    <div className="signUp">
      <h2>Reset Password</h2>
      <Form method="POST">
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="resetString" value={resetString} />
        <input
          type="password"
          name="newPassword"
          placeholder="Enter New Password"
          required
        />

        <Button
          content={"Reset Password"}
          clickStatus={isSubmitting}
          customClasses={"logBtn"}
        />
      </Form>

      {actionData?.message && <p className="verify">{actionData.message}</p>}
      {actionData?.error && <p className="verify">{actionData.error}</p>}
    </div>
  );
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const resetString = formData.get("resetString");
    const newPassword = formData.get("newPassword");

    // API call to reset password
    const response = await axios.post(
      "https://clearq-backend.onrender.com/user/resetPassword",
      {
        userId,
        resetString,
        newPassword,
      }
    );

    // Return success message if status is SUCCESS
    if (response.data.status === "SUCCESS") {
      return { message: response.data.message };
    }

    // Return error message if request failed
    return { error: response.data.message || "Failed to reset password." };
  } catch (error) {
    console.error("Error in ResetPassword action:", error);

    if (error.response) {
      return { error: error.response.data.message || "Server error occurred." };
    }

    return { error: "An unexpected error occurred. Please try again." };
  }
}
