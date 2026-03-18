"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save tokens and user info to localStorage
        localStorage.clear(); // add before setting new values
        localStorage.setItem("accessToken", data.tokens.accessToken);
        localStorage.setItem("idToken", data.tokens.idToken);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userRole", data.user?.role || "Viewer");  // ✅ save role
  localStorage.setItem("userId", data.user?.user_id || "");   // ✅ save user ID
        router.push("/calculator");
      }
       else {
        setError(data.error || "Login failed!");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">
            Login to your RBAC Calculator
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Your password"
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-600"></div>
          <span className="text-slate-500 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-600"></div>
        </div>

        {/* Register link */}
        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-white font-semibold hover:underline"
          >
            Register
          </button>
        </p>

        {/* Back to home */}
        <p className="text-center text-slate-500 text-sm mt-3">
          <button
            onClick={() => router.push("/")}
            className="hover:text-slate-300"
          >
            ← Back to home
          </button>
        </p>

      </div>
    </main>
  );
}