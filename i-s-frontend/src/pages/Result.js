import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div>
        <p>No analysis found.</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>AI Analysis Result</h2>
      <p>{analysis}</p>

      <button onClick={() => navigate("/")}>
        Submit Another Idea
      </button>
    </div>
  );
}

export default Result;
