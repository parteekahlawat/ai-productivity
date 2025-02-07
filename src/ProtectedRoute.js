import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(session ? true : false);
    };

    checkUser();
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>; // Show a loader while checking auth

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
