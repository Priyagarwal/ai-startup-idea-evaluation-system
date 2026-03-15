import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmitIdea() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/submit-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, idea })
    });

    const data = await res.json();
    navigate("/result", { state: data });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Submit Your Startup Idea</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Describe your startup idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Analyze Idea</button>
      </form>
    </div>
  );
}

export default SubmitIdea;