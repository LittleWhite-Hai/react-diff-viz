import { createRoot } from "react-dom/client";
import "./index.css";
import Demo from "./Demo.tsx";
import { calcDiff, calcDiffWithArrayAlign } from "./diff";

createRoot(document.getElementById("root")!).render(<Demo></Demo>);

declare global {
  interface Window {
    calcDiff: typeof calcDiff;
    calcDiffWithArrayAlign: typeof calcDiffWithArrayAlign;
  }
}

window.calcDiff = calcDiff;
window.calcDiffWithArrayAlign = calcDiffWithArrayAlign;
