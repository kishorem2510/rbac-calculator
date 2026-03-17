"use client";
import { useState, useEffect } from "react";

interface Permission {
  [service: string]: string[];
}

interface RoleData {
  role_name: string;
  role_arn: string;
  description: string;
  permissions: Permission;
  created_at: string;
}

const roleConfig: { [key: string]: { icon: string; badge: string; card: string; header: string } } = {
  Admin: {
    icon: "👑",
    badge: "bg-slate-800 text-white",
    card: "border-slate-800 bg-slate-50",
    header: "text-slate-800",
  },
  Member: {
    icon: "👤",
    badge: "bg-slate-800 text-white",
    card: "border-slate-800 bg-slate-50",
    header: "text-slate-800",
  },
  Viewer: {
    icon: "👁️",
    badge: "bg-slate-800 text-white",
    card: "border-slate-800 bg-slate-50",
    header: "text-slate-800",
  },
};

export default function Home() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  const handleRoleSelect = async (roleName: string) => {
    setSelectedRole(roleName);
    if (!roleName) return;
    setLoading(true);
    const res = await fetch(`/api/roles?role=${roleName}`);
    const data = await res.json();
    setRoleData(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Top Navbar */}
      <div className="bg-slate-900 text-white px-10 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <span className="text-xl font-bold tracking-wide">RBAC Calculator</span>
        </div>
        <span className="text-slate-400 text-sm">AWS IAM Role Permission Manager</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Role Based Access Control
          </h2>
          <p className="text-slate-500 mt-1">
            Select a role below to calculate and view its AWS service permissions
          </p>
          <div className="h-1 w-16 bg-slate-800 mt-3 rounded-full"></div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {roles.map((role) => (
            <button
              key={role.role_name}
              onClick={() => handleRoleSelect(role.role_name)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 shadow-sm hover:shadow-md
                ${selectedRole === role.role_name
                  ? "bg-slate-900 border-slate-900 text-white scale-105 shadow-lg"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-900"
                }`}
            >
              <div className="text-3xl mb-3">
                {roleConfig[role.role_name]?.icon}
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

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="inline-block animate-spin text-4xl mb-3">⚙️</div>
            <p className="text-slate-500 font-semibold">
              Calculating permissions...
            </p>
          </div>
        )}

        {/* Role Details */}
        {roleData && !loading && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Role Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">
                  {roleConfig[roleData.role_name]?.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold">
                    {roleData.role_name} Role
                  </h2>
                  <p className="text-slate-300 text-sm">
                    {roleData.description}
                  </p>
                </div>
              </div>
              <span className="bg-slate-700 text-slate-200 text-xs px-3 py-1 rounded-full font-mono">
                IAM Role
              </span>
            </div>

            {/* ARN */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
              <p className="text-xs text-slate-400 font-mono break-all">
                <span className="text-slate-600 font-semibold">ARN: </span>
                {roleData.role_arn}
              </p>
            </div>

            {/* Permissions Table */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Permission Matrix
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800">
                    <th className="p-3 text-left text-slate-800 font-bold text-sm uppercase tracking-wide">
                      AWS Service
                    </th>
                    <th className="p-3 text-left text-slate-800 font-bold text-sm uppercase tracking-wide">
                      Allowed Actions
                    </th>
                    <th className="p-3 text-left text-slate-800 font-bold text-sm uppercase tracking-wide">
                      Access Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(roleData.permissions).map(([service, actions], index) => (
                    <tr
                      key={service}
                      className={`border-b border-slate-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="p-3">
                        <span className="font-bold text-slate-800">
                          {service}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {actions.map((action) => (
                            <span
                              key={action}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                action === "no access"
                                  ? "bg-red-50 text-red-500 border-red-200"
                                  : "bg-slate-800 text-white border-slate-800"
                              }`}
                            >
                              {action === "no access" ? "❌ no access" : `✅ ${action}`}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        {actions.includes("no access") ? (
                          <span className="bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full text-xs font-bold">
                            🚫 No Access
                          </span>
                        ) : actions.length >= 3 ? (
                          <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ✅ Full Access
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 border border-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                            ⚠️ Limited
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Created: {roleData.created_at}
              </p>
              <p className="text-xs text-slate-400">
                Source: AWS IAM + DynamoDB
              </p>
            </div>

          </div>
        )}

        {/* No role selected */}
        {!selectedRole && !loading && (
          <div className="text-center bg-white rounded-2xl shadow p-16">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-xl font-bold text-slate-700 mb-2">
              Select a Role to Begin
            </p>
            <p className="text-slate-400 text-sm">
              Click on Admin, Member or Viewer above to calculate permissions
            </p>
          </div>
        )}

      </div>
    </main>
  );
}