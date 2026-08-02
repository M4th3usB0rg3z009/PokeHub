import { Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Team from "./pages/Team/team";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/time" element={<Team />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;