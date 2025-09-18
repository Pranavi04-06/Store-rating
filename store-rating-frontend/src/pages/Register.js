import React, { useState } from "react";
import API from "../api/axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users", form);
      alert("Registration Successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Name" className="form-control mb-2"
          value={form.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="form-control mb-2"
          value={form.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="form-control mb-2"
          value={form.password} onChange={handleChange} />
        <button type="submit" className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;
