import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";

function AuthPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should show signup form based on query parameter
  const params = new URLSearchParams(location.search);
  const showSignUp = params.get("signup") === "true";

  // React to URL changes while already on the auth pages
  const [isSignUp, setIsSignUp] = React.useState(showSignUp);

  React.useEffect(() => {
    setIsSignUp(showSignUp);
  }, [location.search, showSignUp]);

  // Redirect to home if already logged in
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/user" />;
  }

  const handleAuthSuccess = () => {
    navigate("/user");
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {isSignUp ? t("authForm.createAccount") : t("authForm.signIn")}
      </h1>
      <AuthForm
        onSuccess={handleAuthSuccess}
        initialIsSignUp={isSignUp}
        key={isSignUp.toString()}
      />
    </div>
  );
}

export default AuthPage;
