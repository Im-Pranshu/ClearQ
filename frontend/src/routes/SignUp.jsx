import React from "react";
import "../css/SignPage.css";
import rocket from "../assets/rocket.png";
import Button from "../components/Button";

import {
  Link,
  Form,
  useActionData,
  redirect,
  useNavigation,
} from "react-router-dom";
import axios from "axios"; // Import axios to make API calls

export default function SignUp() {
  const actionData = useActionData(); // Get data or errors returned from the action

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="signUp">
      <img src={rocket} alt="" />

      <h2>Create Your Account</h2>
      <Form method="post">
        <input
          type="text"
          name="name"
          placeholder="Enter Your Name"
          autoComplete="off" // Disable autocomplete for comment input
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email ID"
          autoComplete="off" // Disable autocomplete for comment input
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          autoComplete="off" // Disable autocomplete for comment input
          required
        />

        <Button
          content={"Sign up"}
          clickStatus={isSubmitting}
          customClasses={"logBtn"}
        />

        {actionData && <p className="error">{actionData.error}</p>}

        <p>
          Already registered?{" "}
          <Link className="linkBtn" to={"/sign-in"}>
            Sign in
          </Link>
        </p>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  // Send signup request to the backend API
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await axios.post(
      "https://clearq-backend.onrender.com/user/signup",
      {
        name,
        email,
        password,
      }
    );

    if (response.data.status === "PENDING") {
      // Save user details to localStorage
      localStorage.setItem("userName", name);

      // Redirect to OTP verification or dashboard
      return redirect("/verify-email");
    } else {
      return { error: "Registration failed. Please try again." };
    }
  } catch (error) {
    return {
      error: "An error occurred during registration. Please try again.",
    };
  }
}
