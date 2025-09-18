import React, { useEffect, useState } from "react";
import axios from "axios";

const StoreRating = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState(""); // search query

  useEffect(() => {
    // Fetch stores with ratings from backend
    axios
      .get("http://localhost:3000/stores-with-ratings")
      .then((res) => setStores(res.data))
      .catch((err) => console.error("Error fetching stores:", err));
  }, []);

  // Filtered stores based on search query
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Store Rating</h2>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search for stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "70%",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid #ccc",
          }}
        />
        <button
          style={{
            marginLeft: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Store List */}
      {filteredStores.length > 0 ? (
        filteredStores.map((store) => (
          <div
            key={store.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "15px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>{store.name}</h3>
              <p>{store.location}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p>Overall Rating</p>
              <p>⭐ {parseFloat(store.average_rating || 0).toFixed(1)} / 5</p>
            </div>
            <div>
              <p>Your Rating</p>
              <button
                style={{
                  backgroundColor: store.average_rating ? "blue" : "orange",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {store.average_rating ? "Modify Rating" : "Submit Rating"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No stores found.
        </p>
      )}
    </div>
  );
};

export default StoreRating;



