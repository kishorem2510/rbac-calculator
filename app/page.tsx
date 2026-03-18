"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center px-6">

        {/* Logo */}
        <div className="text-7xl mb-6">🔐</div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4">
          RBAC Calculator
        </h1>
        <p className="text-slate-400 text-xl mb-12">
          Role Based Access Control — Serverless Calculator
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-slate-800 rounded-xl p-5">
            <div className="text-3xl mb-3">🔑</div>
            <h3 className="text-white font-bold mb-1">Secure Auth</h3>
            <p className="text-slate-400 text-sm">
              Email/Password and Phone OTP login
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-5">
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="text-white font-bold mb-1">RBAC Calculator</h3>
            <p className="text-slate-400 text-sm">
              Operations based on your role
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-5">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-white font-bold mb-1">Admin Panel</h3>
            <p className="text-slate-400 text-sm">
              Manage users, roles and history
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all duration-200 border border-slate-600"
          >
            Register
          </button>
        </div>

        {/* Roles info */}
        <div className="mt-12 flex gap-6 justify-center">
          <div className="text-center">
            <span className="text-2xl">👑</span>
            <p className="text-slate-400 text-xs mt-1">Admin</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">👤</span>
            <p className="text-slate-400 text-xs mt-1">Member</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">👁️</span>
            <p className="text-slate-400 text-xs mt-1">Viewer</p>
          </div>
        </div>

      </div>
    </main>
  );
}