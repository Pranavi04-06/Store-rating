import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import API from "../api/axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    API.get("/ratings").then((res) => setRatingsData(res.data));
  }, []);

  const chartData = {
    labels: [...new Set(ratingsData.map((r) => r.store_id))],
    datasets: [
      {
        label: "Average Rating",
        data: [...new Set(ratingsData.map((r) => r.store_id))].map(
          (storeId) => {
            const storeRatings = ratingsData.filter((r) => r.store_id === storeId);
            return (
              storeRatings.reduce((sum, r) => sum + r.rating, 0) /
              storeRatings.length
            );
          }
        ),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default AdminDashboard;
