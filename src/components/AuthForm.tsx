import React, { useState } from "react";
import useSignIn from "../hooks/useSignIn";
import useSignUp from "../hooks/useSignUp";
import Toast from "./Toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  signupSchema,
  LoginFormValues,
  SignupFormValues,
} from "../schemas/authSchemas";

interface AuthFormProps {
  onSuccess?: () => void;
  initialIsSignUp?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSuccess,
  initialIsSignUp = false,
}) => {
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
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  // Switch between login and signup forms
  const toggleFormType = (newType: boolean) => {
    setIsSignUp(newType);
    loginForm.reset();
    signupForm.reset();
  };

  // Handle login form submission
  const handleLoginSubmit = async (data: LoginFormValues) => {
    try {
      await handleSignIn(data.email, data.password);
      setToast({ type: "success", message: "Signed in successfully!" });
      loginForm.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setToast({ type: "error", message: "Authentication failed." });
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (data: SignupFormValues) => {
    try {
      await handleSignUp(data.email, data.password, data.displayName);
      setToast({ type: "success", message: "Account created successfully!" });
      signupForm.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setToast({ type: "error", message: "Authentication failed." });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      {toast && <Toast type={toast.type} message={toast.message} />}

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
          Sign In
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
          Create Account
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
              Display Name
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
              Email
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
              Password
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
            {signUpLoading ? "Creating Account..." : "Create Account"}
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
              Email
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
              Password
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
            {signInLoading ? "Signing In..." : "Sign In"}
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
