import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/firebase";
import { LoadingSpinner } from "./LoadingSpinner";

// We need to add proper typing for the children prop
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // Changed from currentUser to user to match your hook

  if (loading) {
    return (
      <div className="w-full flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}
