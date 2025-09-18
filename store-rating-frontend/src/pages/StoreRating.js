import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StoreRating.css";

function StoreRating() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stores")
      .then((response) => {
        if (response.data.length === 0) {
          // fallback dummy data
          setStores([
            { id: 1, name: "Store Name", address: "175, Nustre Cevaen", overallRating: 4.5, userRating: 4 },
            { id: 2, name: "Wiare Name", address: "123, Vilera, Sesem", overallRating: 4.5, userRating: 2 },
            { id: 3, name: "Unod Name", address: "125, Nadion", overallRating: 4.5, userRating: 5 },
          ]);
        } else {
          setStores(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
        // fallback dummy data on error
        setStores([
          { id: 1, name: "Store Name", address: "175, Nustre Cevaen", overallRating: 4.5, userRating: 4 },
          { id: 2, name: "Wiare Name", address: "123, Vilera, Sesem", overallRating: 4.5, userRating: 2 },
          { id: 3, name: "Unod Name", address: "125, Nadion", overallRating: 4.5, userRating: 5 },
        ]);
      });
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRating = (id, newRating) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id ? { ...store, userRating: newRating } : store
      )
    );
  };

  return (
    <div className="store-rating-container">
      <div className="header">
        <h2>Store Rating</h2>
        <input
          type="text"
          placeholder="Search for stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button className="logout-btn">Logout</button>
      </div>

      <div className="store-list">
        {filteredStores.map((store) => (
          <div key={store.id} className="store-card">
            <div className="store-info">
              <h3>{store.name}</h3>
              <p>{store.address}</p>
            </div>

            <div className="ratings">
              <div className="overall">
                <span>Overall Rating</span>
                <div className="stars">⭐⭐⭐⭐☆</div>
                <p>{store.overallRating} / 5</p>
              </div>

              <div className="your-rating">
                <span>Your Rating</span>
                <div className="stars">
                  {"⭐".repeat(store.userRating || 0)}
                </div>
                <button
                  className={store.userRating ? "modify-btn" : "submit-btn"}
                  onClick={() => handleRating(store.id, 4)} // example static rating
                >
                  {store.userRating ? "Modify Rating" : "Submit Rating"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredStores.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No stores found.
          </p>
        )}
      </div>
    </div>
  );
}

export default StoreRating;





