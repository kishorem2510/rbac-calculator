"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface Role {
  role_name: string;
  operations: string[];
  is_default: boolean;
  created_by: string;
}

interface HistoryItem {
  user_id: string;
  operand1: number;
  operand2: number;
  operation: string;
  result: number;
  timestamp: string;
  role_used: string;
}

export default function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newRole, setNewRole] = useState({
    roleName: "",
    operations: [] as string[],
  });

  const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API_URL!;

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "Admin") {
      router.push("/calculator");
      return;
    }
    fetchUsers();
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const showError = (err: string) => {
    setError(err);
    setTimeout(() => setError(""), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAllUsers" }),
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      showError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAllRoles" }),
      });
      const data = await res.json();
      setRoles(data.roles || []);
    } catch {
      showError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAllHistory" }),
      });
      const data = await res.json();
      setHistory(data.history || []);
    } catch {
      showError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "users") fetchUsers();
    if (tab === "roles") fetchRoles();
    if (tab === "history") fetchHistory();
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateRole",
          userId,
          newRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message);
        fetchUsers();
      } else {
        showError(data.error);
      }
    } catch {
      showError("Failed to update role");
    }
  };

  const handleBlockUser = async (userId: string, email: string) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "blockUser",
          userId,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message);
        fetchUsers();
      } else {
        showError(data.error);
      }
    } catch {
      showError("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId: string, email: string) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unblockUser",
          userId,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message);
        fetchUsers();
      } else {
        showError(data.error);
      }
    } catch {
      showError("Failed to unblock user");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteUser",
          userId,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message);
        fetchUsers();
      } else {
        showError(data.error);
      }
    } catch {
      showError("Failed to delete user");
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.roleName || newRole.operations.length === 0) {
      showError("Please enter role name and select operations!");
      return;
    }
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createRole",
          roleName: newRole.roleName,
          operations: newRole.operations,
          createdBy: localStorage.getItem("userEmail"),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message);
        setNewRole({ roleName: "", operations: [] });
        fetchRoles();
      } else {
        showError(data.error);
      }
    } catch {
      showError("Failed to create role");
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    if (!confirm(`Delete role ${roleName}?`)) return;
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteRole",
          roleName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message);
        fetchRoles();
      } else {
        showError(data.error);
      }
    } catch {
      showError("Failed to delete role");
    }
  };

  const toggleOperation = (op: string) => {
    if (newRole.operations.includes(op)) {
      setNewRole({
        ...newRole,
        operations: newRole.operations.filter((o) => o !== op),
      });
    } else {
      setNewRole({
        ...newRole,
        operations: [...newRole.operations, op],
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 p-6">

      {/* Navbar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <span className="text-white font-bold text-xl">Admin Dashboard</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/calculator")}
            className="bg-slate-700 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-600"
          >
            🧮 Calculator
          </button>
          <button
            onClick={() => { localStorage.clear(); router.push("/"); }}
            className="bg-red-900 text-red-200 px-4 py-2 rounded-xl text-sm hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* Messages */}
        {message && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-xl mb-4">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-4">
            ❌ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "users", label: "👥 Users" },
            { id: "roles", label: "🎭 Roles" },
            { id: "history", label: "📋 History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">
              Manage Users
            </h2>
            {loading ? (
              <p className="text-slate-400 text-center py-10">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-slate-400 text-center py-10">
                No users found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 text-sm p-3">Email</th>
                      <th className="text-left text-slate-400 text-sm p-3">Role</th>
                      <th className="text-left text-slate-400 text-sm p-3">Status</th>
                      <th className="text-left text-slate-400 text-sm p-3">Created</th>
                      <th className="text-left text-slate-400 text-sm p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.user_id}
                        className="border-b border-slate-700 hover:bg-slate-700"
                      >
                        <td className="p-3 text-white text-sm">{user.email}</td>
                        <td className="p-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.user_id, e.target.value)}
                            className="bg-slate-600 text-white rounded-lg px-2 py-1 text-sm"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Member">Member</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            user.status === "active"
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-xs">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {user.status === "active" ? (
                              <button
                                onClick={() => handleBlockUser(user.user_id, user.email)}
                                className="bg-yellow-800 text-yellow-200 px-2 py-1 rounded-lg text-xs hover:bg-yellow-700"
                              >
                                Block
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnblockUser(user.user_id, user.email)}
                                className="bg-green-800 text-green-200 px-2 py-1 rounded-lg text-xs hover:bg-green-700"
                              >
                                Unblock
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.user_id, user.email)}
                              className="bg-red-800 text-red-200 px-2 py-1 rounded-lg text-xs hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-2 gap-6">

            {/* Existing Roles */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">
                Existing Roles
              </h2>
              {loading ? (
                <p className="text-slate-400 text-center py-10">Loading...</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {roles.map((role) => (
                    <div
                      key={role.role_name}
                      className="bg-slate-700 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold">
                          {role.role_name}
                        </h3>
                        <div className="flex gap-2">
                          {role.is_default && (
                            <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          {!role.is_default && (
                            <button
                              onClick={() => handleDeleteRole(role.role_name)}
                              className="bg-red-800 text-red-200 px-2 py-1 rounded-lg text-xs hover:bg-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.operations.map((op) => (
                          <span
                            key={op}
                            className="bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded-full"
                          >
                            {op}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create New Role */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">
                Create Custom Role
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={newRole.roleName}
                    onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
                    placeholder="e.g. Manager"
                    className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Allowed Operations
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["add", "subtract", "multiply", "divide"].map((op) => (
                      <label
                        key={op}
                        className="flex items-center gap-2 bg-slate-700 rounded-xl p-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newRole.operations.includes(op)}
                          onChange={() => toggleOperation(op)}
                          className="accent-white"
                        />
                        <span className="text-white capitalize">{op}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateRole}
                  className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">
              System Wide Calculation History
            </h2>
            {loading ? (
              <p className="text-slate-400 text-center py-10">Loading...</p>
            ) : history.length === 0 ? (
              <p className="text-slate-400 text-center py-10">
                No history found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 text-sm p-3">User</th>
                      <th className="text-left text-slate-400 text-sm p-3">Calculation</th>
                      <th className="text-left text-slate-400 text-sm p-3">Result</th>
                      <th className="text-left text-slate-400 text-sm p-3">Role</th>
                      <th className="text-left text-slate-400 text-sm p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700 hover:bg-slate-700"
                      >
                        <td className="p-3 text-slate-400 text-xs">
                          {item.user_id.substring(0, 8)}...
                        </td>
                        <td className="p-3 text-white text-sm">
                          {item.operand1} {item.operation} {item.operand2}
                        </td>
                        <td className="p-3 text-white font-bold">
                          {item.result}
                        </td>
                        <td className="p-3">
                          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                            {item.role_used}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}