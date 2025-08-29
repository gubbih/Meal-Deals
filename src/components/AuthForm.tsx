import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useSignIn from "../hooks/useSignIn";
import useSignUp from "../hooks/useSignUp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "../schemas/authSchemas";
import { useToast } from "../contexts/ToastContext";

interface AuthFormProps {
  onSuccess?: () => void;
  initialIsSignUp?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSuccess,
  initialIsSignUp = false,
}) => {
  const { t } = useTranslation();
  const {
    handleSignIn,
    loading: signInLoading,
    error: signInError,
  } = useSignIn();
  const {
    handleSignUp,
    loading: signUpLoading,
    error: signUpError,
  } = useSignUp();

  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const { showToast } = useToast();

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Signup form
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  // We use separate forms for login and signup

  // Switch between login and signup forms
  const toggleFormType = (newType: boolean) => {
    setIsSignUp(newType);
    loginForm.reset();
    signupForm.reset();
  };

  // Handle login form submission
  const handleLoginSubmit = async (data: any) => {
    try {
      await handleSignIn(data.email, data.password);
      showToast("success", t("authForm.toast.signInSuccess"));
      loginForm.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showToast("error", t("authForm.toast.authFailed"));
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (data: any) => {
    try {
      await handleSignUp(data.email, data.password, data.displayName);
      showToast("success", t("authForm.toast.signUpSuccess"));
      signupForm.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showToast("error", t("authForm.toast.authFailed"));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-2">
        <button
          onClick={() => toggleFormType(false)}
          className={`px-4 py-2 font-medium rounded-lg w-full sm:w-auto ${
            !isSignUp
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300"
          }`}
          type="button"
        >
          {t("authForm.signIn")}
        </button>
        <button
          onClick={() => toggleFormType(true)}
          className={`px-4 py-2 font-medium rounded-lg w-full sm:w-auto ${
            isSignUp
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300"
          }`}
          type="button"
        >
          {t("authForm.createAccount")}
        </button>
      </div>

      {isSignUp ? (
        // Signup Form
        <form
          onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("authForm.displayName")}
            </label>
            <input
              id="displayName"
              type="text"
              {...signupForm.register("displayName")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {signupForm.formState.errors.displayName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {signupForm.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("authForm.email")}
            </label>
            <input
              id="signup-email"
              type="email"
              {...signupForm.register("email")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {signupForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {signupForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("authForm.password")}
            </label>
            <input
              id="signup-password"
              type="password"
              {...signupForm.register("password")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {signupForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {signupForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={signUpLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
          >
            {signUpLoading ? t("authForm.creatingAccount") : t("authForm.createAccount")}
          </button>

          {signUpError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {signUpError}
            </p>
          )}
        </form>
      ) : (
        // Login Form
        <form
          onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("authForm.email")}
            </label>
            <input
              id="login-email"
              type="email"
              {...loginForm.register("email")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("authForm.password")}
            </label>
            <input
              id="login-password"
              type="password"
              {...loginForm.register("password")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={signInLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
          >
            {signInLoading ? t("authForm.signingIn") : t("authForm.signIn")}
          </button>

          {signInError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {signInError}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default AuthForm;
