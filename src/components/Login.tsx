"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import Image from "next/image";
import { logClick, logKeyPress, logCustom } from "@/lib/logger";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    logClick("Submit login form", "login-form-submit");

    try {
      await login(email, password);
      logCustom(`User logged in: ${email}`, "USER_LOGIN", {
        email,
        success: true,
      });
    } catch (err) {
      setError("Invalid email or password");
      logCustom(`Login failed for: ${email}`, "USER_LOGIN", {
        email,
        success: false,
        error: "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, demoPassword: string) => {
    logClick(`Quick login as: ${demoEmail}`, `quick-login-${demoEmail}`);

    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    try {
      await login(demoEmail, demoPassword);
      logCustom(`User logged in via quick login: ${demoEmail}`, "USER_LOGIN", {
        email: demoEmail,
        success: true,
        method: "quick_login",
      });
    } catch (err) {
      setError("Login failed");
      logCustom(`Quick login failed for: ${demoEmail}`, "USER_LOGIN", {
        email: demoEmail,
        success: false,
        method: "quick_login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      logKeyPress("Enter pressed in email field", "login-email-input", "Enter");
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      logKeyPress(
        "Enter pressed in password field",
        "login-password-input",
        "Enter",
      );
    }
  };

  return (
    <div className="sm:px-6 lg:px-8 flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            width={80}
            height={80}
            alt="logo"
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Google Drive Clone
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleEmailKeyPress}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handlePasswordKeyPress}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or use demo accounts
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => quickLogin("demo@example.com", "password")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => quickLogin("test@example.com", "password")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Test User
            </button>
          </div>

          <div className="mt-4 rounded-md bg-blue-50 p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium">Demo Credentials:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Email: demo@example.com</li>
                <li>• Password: password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
