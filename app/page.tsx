"use client";
import { useEffect, useState } from "react";

interface RoleData {
  role_name: string;
  role_arn: string;
  description: string;
  permissions: { [service: string]: string[] };
}

interface Check {
  service: string;
  action: string;
}

interface Result {
  service: string;
  action: string;
  allowed: boolean;
  message: string;
}

interface CalculationResult {
  role: string;
  results: Result[];
  summary: {
    total: number;
    allowed: number;
    blocked: number;
  };
}

const serviceActions: { [service: string]: string[] } = {
  S3: ["read", "write", "delete"],
  DynamoDB: ["read", "write", "delete"],
  Lambda: ["invoke", "manage"],
  CloudWatch: ["read"],
  IAM: ["read"],
};

const roleIcons: { [key: string]: string } = {
  Admin: "👑",
  Member: "👤",
  Viewer: "👁️",
};

export default function Home() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedChecks, setSelectedChecks] = useState<Check[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);
    setSelectedChecks([]);
    setResult(null);
  };

  const handleCheckbox = (service: string, action: string) => {
    const exists = selectedChecks.find(
      (c) => c.service === service && c.action === action
    );
    if (exists) {
      setSelectedChecks(
        selectedChecks.filter(
          (c) => !(c.service === service && c.action === action)
        )
      );
    } else {
      setSelectedChecks([...selectedChecks, { service, action }]);
    }
  };

  const isChecked = (service: string, action: string) => {
    return selectedChecks.some(
      (c) => c.service === service && c.action === action
    );
  };

  const handleCalculate = async () => {
    if (!selectedRole || selectedChecks.length === 0) return;
    setCalculating(true);
    setResult(null);

    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: selectedRole,
        checks: selectedChecks,
      }),
    });

    const data = await res.json();
    setResult(data);
    setCalculating(false);
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <div className="bg-slate-900 text-white px-10 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <span className="text-xl font-bold tracking-wide">
            RBAC Calculator
          </span>
        </div>
        <span className="text-slate-400 text-sm">
          AWS IAM Role Permission Calculator
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Role Based Access Control
          </h2>
          <p className="text-slate-500 mt-1">
            Select a role, choose actions and calculate access
          </p>
          <div className="h-1 w-16 bg-slate-800 mt-3 rounded-full"></div>
        </div>

        {/* Step 1 - Select Role */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Step 1 — Select Role
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {roles.map((role) => (
              <button
                key={role.role_name}
                onClick={() => handleRoleSelect(role.role_name)}
                className={`p-5 rounded-xl border-2 text-left transition-all duration-200 shadow-sm hover:shadow-md
                  ${selectedRole === role.role_name
                    ? "bg-slate-900 border-slate-900 text-white scale-105 shadow-lg"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-900"
                  }`}
              >
                <div className="text-3xl mb-2">
                  {roleIcons[role.role_name]}
                </div>
                <div className="text-lg font-bold mb-1">
                  {role.role_name}
                </div>
                <div className={`text-xs ${selectedRole === role.role_name ? "text-slate-300" : "text-slate-400"}`}>
                  {role.role_name === "Admin" && "Full AWS access"}
                  {role.role_name === "Member" && "Limited AWS access"}
                  {role.role_name === "Viewer" && "Read only access"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 - Select Actions */}
        {selectedRole && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Step 2 — Select Actions to Check
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(serviceActions).map(([service, actions]) => (
                <div
                  key={service}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <h4 className="font-bold text-slate-700 mb-3">
                    {service}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {actions.map((action) => (
                      <label
                        key={action}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked(service, action)}
                          onChange={() => handleCheckbox(service, action)}
                          className="w-4 h-4 accent-slate-800 cursor-pointer"
                        />
                        <span className="text-slate-600 group-hover:text-slate-900 text-sm capitalize">
                          {action}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 - Calculate */}
        {selectedRole && selectedChecks.length > 0 && (
          <div className="mb-6">
            <button
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {calculating ? "⚙️ Calculating..." : "🔐 CALCULATE ACCESS"}
            </button>
          </div>
        )}

        {/* Results */}
        {result && !calculating && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Result Header */}
            <div className="bg-slate-900 text-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {roleIcons[result.role]}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">
                      {result.role} Role — Calculation Result
                    </h2>
                    <p className="text-slate-300 text-sm">
                      Lambda calculated access for {result.summary.total} action(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-slate-100">
              <div className="text-center bg-slate-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-slate-800">
                  {result.summary.total}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
                  Total Checked
                </div>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">
                  {result.summary.allowed}
                </div>
                <div className="text-xs text-green-500 mt-1 uppercase tracking-wide">
                  Allowed
                </div>
              </div>
              <div className="text-center bg-red-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-600">
                  {result.summary.blocked}
                </div>
                <div className="text-xs text-red-500 mt-1 uppercase tracking-wide">
                  Blocked
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Detailed Results
              </h3>
              <div className="flex flex-col gap-3">
                {result.results.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      item.allowed
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {item.allowed ? "✅" : "❌"}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">
                          {item.service} — {item.action}
                        </p>
                        <p className={`text-sm ${item.allowed ? "text-green-600" : "text-red-500"}`}>
                          {item.message}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.allowed
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}>
                      {item.allowed ? "ALLOWED" : "BLOCKED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between">
              <p className="text-xs text-slate-400">
                Calculated by: AWS Lambda
              </p>
              <p className="text-xs text-slate-400">
                Source: AWS IAM + DynamoDB
              </p>
            </div>

          </div>
        )}

        {/* Initial state */}
        {!selectedRole && (
          <div className="text-center bg-white rounded-2xl shadow p-16">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-xl font-bold text-slate-700 mb-2">
              Select a Role to Begin
            </p>
            <p className="text-slate-400 text-sm">
              Choose a role → select actions → calculate access
            </p>
          </div>
        )}

      </div>
    </main>
  );
}