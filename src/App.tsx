import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Diff from "./diff";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <Diff
        beforeData={{ a: 3 }}
        currentData={{ a: 4 }}
        fieldItems={[{ label: "a", path: "a" }]}
      />
    </>
  );
}

export default App;
