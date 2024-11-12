import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import DiffWrapperDemo from "./DiffWrapperDemo.tsx";
import "./index.css";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <App />
  // <DiffWrapperDemo />
);
