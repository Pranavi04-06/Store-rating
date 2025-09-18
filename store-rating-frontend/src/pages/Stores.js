import React, { useEffect, useState } from "react";
import API from "../api/axios";

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    API.get("/stores").then((res) => setStores(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Stores</h2>
      <ul className="list-group">
        {stores.map((store) => (
          <li key={store.id} className="list-group-item">
            {store.name} - {store.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Stores;
