import React, { useEffect, useState } from "react";
import API from "../api/axios";

function Ratings() {
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState({ user_id: "", store_id: "", rating: "" });

  const fetchRatings = async () => {
    const res = await API.get("/ratings");
    setRatings(res.data);
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleChange = (e) => {
    setNewRating({ ...newRating, [e.target.name]: e.target.value });
  };

  const addRating = async (e) => {
    e.preventDefault();
    try {
      await API.post("/ratings", newRating);
      fetchRatings();
      setNewRating({ user_id: "", store_id: "", rating: "" });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Ratings</h2>
      <form onSubmit={addRating} className="mb-4">
        <input type="number" name="user_id" placeholder="User ID"
          className="form-control mb-2" value={newRating.user_id}
          onChange={handleChange} />
        <input type="number" name="store_id" placeholder="Store ID"
          className="form-control mb-2" value={newRating.store_id}
          onChange={handleChange} />
        <input type="number" name="rating" placeholder="Rating (1-5)"
          className="form-control mb-2" value={newRating.rating}
          onChange={handleChange} />
        <button type="submit" className="btn btn-primary w-100">Add Rating</button>
      </form>

      <ul className="list-group">
        {ratings.map((r) => (
          <li key={r.id} className="list-group-item">
            User {r.user_id} → Store {r.store_id} : ⭐ {r.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ratings;
