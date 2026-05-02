const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

/*
  Authentication, MFA, and user management are handled
  entirely by Firebase Authentication.
  This backend is intentionally stateless.
*/

/* ================= OPTIONAL BUSINESS API ================= */
app.post("/payment", (req, res) => {
  // Payment data is already validated and stored in Firestore
  // This endpoint exists for future expansion or auditing
  res.send("Payment received");
});

/* ================= START SERVER ================= */
app.listen(3001, () => {
  console.log("Backend running on port 3001 (Auth handled by Firebase)");
});
