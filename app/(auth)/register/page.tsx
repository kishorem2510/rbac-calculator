"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Viewer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("pendingEmail", formData.email);
        router.push("/verify");
      } else {
        setError(data.error || "Registration failed!");
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
          <div className="text-5xl mb-3">📝</div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">
            Register to use RBAC Calculator
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Email *
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
              Phone Number (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91xxxxxxxxxx"
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
            >
              <option value="Viewer">👁️ Viewer — Add only</option>
              <option value="Member">👤 Member — Add, Subtract, Multiply</option>
              <option value="Admin">👑 Admin — All operations</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min 8 characters"
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat password"
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* Login link */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-white font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </main>
  );
}