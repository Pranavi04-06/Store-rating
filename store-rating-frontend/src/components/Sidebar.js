import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "220px" }}>
      <h4 className="text-center">Menu</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/stores" className="nav-link text-white">Stores</Link>
        </li>
        <li className="nav-item">
          <Link to="/ratings" className="nav-link text-white">Ratings</Link>
        </li>
        <li className="nav-item">
          <Link to="/users" className="nav-link text-white">Users</Link>
        </li>
        <li className="nav-item">
          <Link to="/store-rating" className="nav-link text-white">StoreRating</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
