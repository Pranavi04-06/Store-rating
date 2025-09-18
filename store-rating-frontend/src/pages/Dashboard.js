import React from "react";

function Dashboard() {
  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      <p>Welcome! Here you can view stores and give ratings.</p>
      <a href="/stores" className="btn btn-outline-primary me-2">Browse Stores</a>
      <a href="/ratings" className="btn btn-outline-success">My Ratings</a>
    </div>
  );
}

export default Dashboard;

