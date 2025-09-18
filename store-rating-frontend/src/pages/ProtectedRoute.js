import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user"); // check login

  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
