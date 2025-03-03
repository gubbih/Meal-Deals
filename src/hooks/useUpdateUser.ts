// src/hooks/useUpdateUserProfile.ts
import { useState } from "react";
import { updateUser } from "../services/firebase";
import { User } from "../models/User";
import { useAuth } from "../services/firebase";

function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!currentUser) {
      setError("No user is logged in");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedUser: User = {
        ...currentUser,
        ...userData,
      };
      await updateUser(updatedUser);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return { updateUserProfile, loading, error };
}

export default useUpdateUserProfile;
