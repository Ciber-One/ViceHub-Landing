import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { admin, checked } = useAuth();
  if (!checked || admin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vice-bg">
        <Loader2 className="h-6 w-6 animate-spin text-sunset" />
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};
