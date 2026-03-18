"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Verify() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");
    if (!pendingEmail) {
      router.push("/register");
    } else {
      setEmail(pendingEmail);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email,
          code,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Email verified successfully!");
        localStorage.removeItem("pendingEmail");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Verification failed!");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resend",
          email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Verification code resent to your email!");
      } else {
        setError(data.error || "Failed to resend code!");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📧</div>
          <h1 className="text-2xl font-bold text-white">
            Verify Your Email
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            We sent a verification code to
          </p>
          <p className="text-white font-semibold mt-1">{email}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-xl mb-6 text-sm">
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter 6 digit code"
              maxLength={6}
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500 text-center text-2xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-white font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>

        {/* Back */}
        <p className="text-center text-slate-500 text-sm mt-4">
          <button
            onClick={() => router.push("/register")}
            className="hover:text-slate-300"
          >
            ← Back to register
          </button>
        </p>

      </div>
    </main>
  );
}