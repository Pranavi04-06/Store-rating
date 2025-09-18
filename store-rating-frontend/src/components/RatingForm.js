import { useState } from "react";
import api from "../api";

export default function RatingForm() {
  const [userId, setUserId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/ratings", { userId, storeId, rating })
      .then(() => alert("Rating submitted successfully"))
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h2>Submit Rating</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>User ID</label>
          <input type="number" className="form-control" value={userId} onChange={e => setUserId(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Store ID</label>
          <input type="number" className="form-control" value={storeId} onChange={e => setStoreId(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Rating (1-5)</label>
          <input type="number" className="form-control" value={rating} onChange={e => setRating(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
