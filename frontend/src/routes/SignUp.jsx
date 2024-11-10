import React from "react";
import "../css/SignPage.css";
import {
  Link,
  Form,
  useActionData,
  redirect,
  useNavigation,
} from "react-router-dom";
import rocket from "../assets/rocket.png";
import Button from "../components/Button";

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
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email ID"
          autoComplete="off" // Disable autocomplete for comment input
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          autoComplete="off" // Disable autocomplete for comment input
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
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  localStorage.setItem("userName", name); // for displaying in account profile

  // Redirect to OTP verification page
  return redirect("/dashboard");
}
