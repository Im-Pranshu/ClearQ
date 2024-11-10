import React from "react";
import "../css/SignPage.css";
import rocket from "../assets/rocket.png";
import Button from "../components/Button";

import { Link, Form, redirect, useNavigation } from "react-router-dom";

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"; // Check if the form is being submitted

  return (
    <div className="signUp">
      <img src={rocket} alt="" />
      <h2>Enter Your Details</h2>
      <Form method="POST">
        <input type="email" name="email" placeholder="Enter Email ID" />
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
        />

        <Button
          content={"Sign in"}
          clickStatus={isSubmitting}
          customClasses={"logBtn"}
        />

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

  return redirect("/dashboard");
}
