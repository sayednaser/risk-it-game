import { MemoryRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import GamePage from "./GamePage";
import MainMenuPage from "./HomePage";

function App() {
  const info = {
    Conqured: "50%",
    Army: "500 (+200)",
    Phase: "Draft",
  };

  return (
    <MemoryRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenuPage />} />
          <Route path="game" element={<GamePage />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export default App;
