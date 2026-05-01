const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

let users = [];

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).send("Invalid username. Use 3–20 letters or numbers only.");
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).send("Invalid password. Use at least 6 characters with letters and numbers.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword
  });

  res.send("Customer registered successfully. Password was hashed and salted.");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(400).send("User not found.");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send("Invalid password.");
  }

  res.send("Login successful.");
});

app.post("/payment", (req, res) => {
  const { recipient, accountNumber, amount } = req.body;

  const recipientRegex = /^[A-Za-z\s]{2,50}$/;
  const accountRegex = /^[0-9]{8,20}$/;
  const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  if (!recipientRegex.test(recipient)) {
    return res.status(400).send("Invalid recipient name. Letters only.");
  }

  if (!accountRegex.test(accountNumber)) {
    return res.status(400).send("Invalid account number. Use 8–20 digits only.");
  }

  if (!amountRegex.test(amount)) {
    return res.status(400).send("Invalid amount format.");
  }

  res.send("International payment submitted successfully.");
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
})