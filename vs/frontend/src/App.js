import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recipient, setRecipient] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  const recipientRegex = /^[A-Za-z\s]{2,50}$/;
  const accountRegex = /^[0-9]{8,20}$/;
  const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  const validateRegister = () => {
    if (!usernameRegex.test(username)) {
      setMessage("Username must be 3–20 characters and contain letters or numbers only.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 6 characters and include letters and numbers.");
      return false;
    }

    return true;
  };

  const validatePayment = () => {
    if (!recipientRegex.test(recipient)) {
      setMessage("Recipient name must contain letters only.");
      return false;
    }

    if (!accountRegex.test(accountNumber)) {
      setMessage("Account number must contain 8–20 digits only.");
      return false;
    }

    if (!amountRegex.test(amount)) {
      setMessage("Amount must be a valid number, for example 500 or 500.50.");
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validateRegister()) return;

    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.text();
    setMessage(data);
  };

  const login = async () => {
    if (!validateRegister()) return;

    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.text();
    setMessage(data);
  };

  const makePayment = async () => {
    if (!validatePayment()) return;

    const response = await fetch("http://localhost:3001/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, accountNumber, amount })
    });

    const data = await response.text();
    setMessage(data);
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Secure Customer International Payments Portal</h1>
        <p className="intro">
          This portal demonstrates secure registration, login, input validation,
          password hashing and protection against common web attacks.
        </p>

        <div className="section">
          <h2>Register Customer</h2>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={register}>Register</button>
        </div>

        <div className="section">
          <h2>Customer Login</h2>
          <button onClick={login}>Login</button>
        </div>

        <div className="section">
          <h2>International Payment</h2>
          <input placeholder="Recipient Name" onChange={(e) => setRecipient(e.target.value)} />
          <input placeholder="Account Number" onChange={(e) => setAccountNumber(e.target.value)} />
          <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={makePayment}>Submit Payment</button>
        </div>

        <div className="section security">
          <h2>Security Features</h2>
          <ol>
            <li>Password hashing and salting is applied using bcrypt.</li>
            <li>Input fields are whitelisted using RegEx validation.</li>
            <li>SSL/HTTPS should be used to secure traffic in production.</li>
            <li>Helmet is used in the API to protect against common web attacks.</li>
          </ol>
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;