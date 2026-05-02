import React, { useState, useEffect } from "react";
import "./App.css";

// ✅ Firebase imports
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { collection, addDoc } from "firebase/firestore";

function App() {
  const [page, setPage] = useState("register");
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [currency, setCurrency] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Listen for login state (Firebase handles MFA automatically)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) setPage("payment");
      else setPage("login");
    });

    return () => unsub();
  }, []);

  /* ================= REGISTER ================= */
  const register = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Save user profile in Firestore
      await addDoc(collection(db, "users"), {
        uid: cred.user.uid,
        username,
        email,
        idNumber,
        accountNumber,
        createdAt: new Date()
      });

      setMessage("Registered successfully");
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      setMessage(err.message);
    }
  };

  /* ================= LOGIN ================= */
  const login = async () => {
    try {
      // ✅ Firebase will automatically trigger MFA if enabled
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful");
    } catch (err) {
      setMessage(err.message);
    }
  };

  /* ================= PAYMENT ================= */
const submitPayment = async () => {
  try {
    await addDoc(collection(db, "payments"), {
      userId: currentUser.uid,
      recipient,
      amount: Number(amount),
      swiftCode,
      currency,
      createdAt: new Date()
    });

    setMessage("Payment submitted successfully");
  } catch (err) {
    console.error(err);
    setMessage("Payment failed: " + err.message);
  }
};

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await signOut(auth);
    setPage("login");
  };

  return (
    <div className="app-background">
      <div className="form-card">

        {message && <div className="message">{message}</div>}

        {/* ================= REGISTER ================= */}
        {!currentUser && page === "register" && (
          <>
            <h1>REGISTER</h1>

            <label>USERNAME</label>
            <input value={username} onChange={e => setUsername(e.target.value)} />

            <label>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />

            <label>ID NUMBER</label>
            <input value={idNumber} onChange={e => setIdNumber(e.target.value)} />

            <label>ACCOUNT NUMBER</label>
            <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />

            <label>PASSWORD</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button onClick={register}>Register</button>

            <p>
              Already have an account?{" "}
              <span onClick={() => setPage("login")}>Login</span>
            </p>
          </>
        )}

        {/* ================= LOGIN ================= */}
        {!currentUser && page === "login" && (
          <>
            <h1>LOGIN</h1>

            <label>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />

            <label>PASSWORD</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button onClick={login}>Login</button>
            <button className="secondary-btn" onClick={() => setPage("register")}>
              Back
            </button>
          </>
        )}

        {/* ================= PAYMENT ================= */}
        {currentUser && page === "payment" && (
          <>
            <h1>MAKE A PAYMENT</h1>

            <label>RECIPIENT NAME</label>
            <input value={recipient} onChange={e => setRecipient(e.target.value)} />

            <label>AMOUNT</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} />

            <label>SWIFT CODE</label>
            <input value={swiftCode} onChange={e => setSwiftCode(e.target.value)} />

            <label>CURRENCY</label>
            <input value={currency} onChange={e => setCurrency(e.target.value)} />

            <button onClick={submitPayment}>Pay Now</button>
            <button className="secondary-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default App;