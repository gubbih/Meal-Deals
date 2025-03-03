import { useState } from "react";
import { signUp } from "../services/firebase";
import { User } from "../models/User";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleSignUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await signUp(email, password, displayName);
      setUser(newUser);
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

  return { handleSignUp, user, loading, error };
};

export default useSignUp;
