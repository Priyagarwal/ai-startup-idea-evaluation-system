import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🚀 AI Startup Idea Validator</h1>
      <p>Turn your startup idea into a validated opportunity.</p>
      <button onClick={() => navigate("/submit")}>
        Start Building
      </button>
    </div>
  );
}

export default Home;