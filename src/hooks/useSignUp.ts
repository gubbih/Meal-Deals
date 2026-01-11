import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../models/User";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { signUp } = useAuth();

  const handleSignUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, displayName);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      throw err; // Re-throw the error so AuthForm can handle it properly
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, user, loading, error };
};

export default useSignUp;
