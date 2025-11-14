"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    if (res?.error) {
      setError("Email or Password is Wrong!");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <form
        onSubmit={handleSubmit}
        className="animate-fadeIn bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label className="block text-gray-200 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
            placeholder="admin@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-200 text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/30"
        >
          Login
        </button>
      </form>
    </div>
  );
}
