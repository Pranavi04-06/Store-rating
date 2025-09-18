import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import Ratings from "./pages/Ratings";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoreRating from "./pages/StoreRating";




function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Navbar />
          <main className="container mt-4">
            <Routes>
  <Route path="/" element={<Login />} />   {/* 👈 Set Login as default */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/stores" element={<Stores />} />
  <Route path="/ratings" element={<Ratings />} />
  <Route path="/users" element={<Users />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/store-rating" element={<StoreRating />} />
</Routes>

          </main>
        </div>
      </div>
    </Router>
  );
}




export default App;




