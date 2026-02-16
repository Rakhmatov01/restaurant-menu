import "./Login.css";
import { useState } from "react";
import React from "react";
import { startSession } from "./api";
function Login({ setToken, tableNumber, setActive }) {
  console.log("working");
  const [error, setError] = useState("");
  async function onHandleForm(e, customerName) {
    localStorage.clear();
    e.preventDefault();
    setError("");
    if (!customerName) {
      setError("Username is required!");
      return;
    }
    try {
      const token = await startSession({ tableNumber, customerName });
      localStorage.setItem("session_token", token.token);
      setToken(token.token);
      setActive(true);
    } catch (err) {
      setError(err?.error || err?.message || "Failed to start session");
    }
  }
  return (
    <div className="login-body">
      <div className="login-container">
        <h1>G'ijduvon Kafe </h1>
        <Header tableNumber={tableNumber} />
        <Form handleForm={onHandleForm} error={error} />
      </div>
    </div>
  );
}

function Header({ tableNumber }) {
  return (
    <div className="header">
      <h3>Table {tableNumber}</h3>
      <p>Welcome Guest</p>
    </div>
  );
}

function Form({ handleForm, error }) {
  const [customerName, setCustomerName] = useState("");
  return (
    <div className="form-container">
      <h2>Ready to feast?</h2>
      <p>Enter your name</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={(e) => handleForm(e, customerName)}>
        <input
          type="text"
          placeholder="Your Name (e.g John)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        ></input>
        <button>Start ordering</button>
      </form>
    </div>
  );
}

export default Login;
