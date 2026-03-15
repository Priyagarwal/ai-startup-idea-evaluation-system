const sql = require("mssql");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================
// DATABASE CONFIG
// ==========================
const dbConfig = {
  user: "appuser",
  password: "AppUser@123",
  server: "localhost",
  instanceName: "SQLEXPRESS",
  database: "AIStartupPlatform",
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// ==========================
// CONNECT ON START
// ==========================
sql.connect(dbConfig)
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// ==========================
// 1️⃣ REGISTER FOUNDER
// ==========================
app.post("/register-founder", async (req, res) => {
  const { name, email } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const existing = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Founders WHERE email = @email");

    if (existing.recordset.length > 0) {
      return res.json({
        message: "Founder already exists",
        founder_id: existing.recordset[0].id
      });
    }

    const result = await pool.request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .query(`
        INSERT INTO Founders (name, email)
        OUTPUT INSERTED.id
        VALUES (@name, @email)
      `);

    res.json({
      message: "Founder registered successfully ✅",
      founder_id: result.recordset[0].id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// 2️⃣ ANALYZE IDEA (Basic AI Engine)
// ==========================
app.post("/analyze-idea", async (req, res) => {
  const { founder_id, idea_text } = req.body;

  try {
    // 🔹 Simple rule-based scoring engine
    let score = 50;
    let market_potential = "Moderate";
    let revenue_model = "Needs clarification";
    let competition_level = "Medium";
    let improvements = "Refine target audience and monetization.";

    const idea = idea_text.toLowerCase();

    if (idea.includes("ai")) score += 15;
    if (idea.includes("saas")) score += 10;
    if (idea.includes("subscription")) {
      revenue_model = "Subscription-based model";
      score += 10;
    }
    if (idea.includes("marketplace")) {
      competition_level = "High";
      score -= 5;
    }

    if (score > 80) market_potential = "High";
    if (score < 60) market_potential = "Low";

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("founder_id", sql.Int, founder_id)
      .input("idea_text", sql.NVarChar, idea_text)
      .input("ai_score", sql.Int, score)
      .input("market_potential", sql.NVarChar, market_potential)
      .input("revenue_model", sql.NVarChar, revenue_model)
      .input("competition_level", sql.NVarChar, competition_level)
      .input("improvements", sql.NVarChar, improvements)
      .query(`
        INSERT INTO Ideas 
        (founder_id, idea_text, ai_score, market_potential, revenue_model, competition_level, improvements)
        VALUES 
        (@founder_id, @idea_text, @ai_score, @market_potential, @revenue_model, @competition_level, @improvements)
      `);

    res.json({
      message: "Idea analyzed successfully 🚀",
      score,
      market_potential,
      revenue_model,
      competition_level,
      improvements
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// START SERVER
// ==========================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});


//submit idea

app.post("/submit-idea", async (req, res) => {
  const { name, email, idea } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    // 1️⃣ Check if founder exists
    let founderResult = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Founders WHERE email = @email");

    let founderId;

    if (founderResult.recordset.length > 0) {
      founderId = founderResult.recordset[0].id;
    } else {
      // 2️⃣ Insert new founder
      const newFounder = await pool.request()
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .query(`
          INSERT INTO Founders (name, email)
          OUTPUT INSERTED.id
          VALUES (@name, @email)
        `);

      founderId = newFounder.recordset[0].id;
    }

    // 3️⃣ Insert idea
    await pool.request()
      .input("founder_id", sql.Int, founderId)
      .input("idea", sql.NVarChar, idea)
      .query(`
        INSERT INTO Ideas (founder_id, idea_description)
        VALUES (@founder_id, @idea)
      `);

    // 4️⃣ Fake AI analysis (temporary)
    res.json({
      analysis: "Your startup idea has strong potential 🚀. Consider validating the market demand and identifying early adopters."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});