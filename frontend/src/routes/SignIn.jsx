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

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"; // Check if the form is being submitted
  const actionData = useActionData(); // This will capture any error messages or feedback from the action

  return (
    <div className="signUp">
      <img src={rocket} alt="" />
      <h2>Enter Your Details</h2>
      <Form method="POST">
        <input
          type="email"
          name="email"
          placeholder="Enter Email ID"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          // required
        />

        <Button
          content={"Sign in"}
          clickStatus={isSubmitting}
          customClasses={"logBtn"}
        />

        {actionData && <p className="error">{actionData.error}</p>}

        <p>
          Not registered yet?{" "}
          <Link className="linkBtn" to={"/sign-up"}>
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Send login request to the backend API
  try {
    const response = await axios.post("http://localhost:3000/user/signin", {
      email,
      password,
    });

    if (response.data.status === "SUCCESS") {
      // On success, redirect to the dashboard
      return redirect("/dashboard");
    } else {
      // If login fails, return error message
      return { error: "Invalid credentials. Please try again." };
    }
  } catch (error) {
    // Catch any errors and send them to the frontend
    return { error: "An error occurred during login. Please try again." };
  }
}
