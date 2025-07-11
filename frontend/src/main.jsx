import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";

// Router
import { RouterProvider } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // Import routing configuration

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={AppRoutes} />
  </StrictMode>
);
