import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoutes;
