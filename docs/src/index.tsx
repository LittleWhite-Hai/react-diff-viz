import { createRoot } from "react-dom/client";

import "./index.css";
import React from "react";
import Demo from "./Demo.tsx";

createRoot(document.getElementById("root")!).render(<Demo></Demo>);
