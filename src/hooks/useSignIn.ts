import { useState } from "react";
import { signIn } from "../services/firebase";

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
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

  return { handleSignIn, loading, error };
};

export default useSignIn;
