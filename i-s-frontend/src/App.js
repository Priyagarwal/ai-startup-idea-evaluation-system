import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubmitIdea from "./pages/SubmitIdea";
import Result from "./pages/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;