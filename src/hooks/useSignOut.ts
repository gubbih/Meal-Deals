import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSignOut, loading, error };
};

export default useSignOut;
