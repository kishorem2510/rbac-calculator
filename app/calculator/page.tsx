"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HistoryItem {
  operand1: number;
  operand2: number;
  operation: string;
  result: number;
  timestamp: string;
  role_used: string;
}

const operationSymbols: { [key: string]: string } = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
};

export default function Calculator() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string; userId: string } | null>(null);
  const [display, setDisplay] = useState("0");
  const [operand1, setOperand1] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand2, setWaitingForOperand2] = useState(false);
  const [allowedOperations, setAllowedOperations] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!email) {
      router.push("/login");
      return;
    }

    const userData = {
      email,
      role: role || "Viewer",
      userId: userId || email,
    };
    setUser(userData);
    fetchAllowedOperations(userData.role);
    fetchHistory(userData.userId);
  }, []);

  const fetchAllowedOperations = async (role: string) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CALCULATOR_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getRoleOperations",
          role,
        }),
      });
      const data = await res.json();
      setAllowedOperations(data.allowedOperations || []);
    } catch (err) {
      console.error("Failed to fetch operations");
    }
  };

  const fetchHistory = async (userId: string) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CALCULATOR_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getHistory",
          userId,
        }),
      });
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleNumber = (num: string) => {
    setError("");
    if (waitingForOperand2) {
      setDisplay(num);
      setWaitingForOperand2(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: string) => {
    setError("");
    if (!allowedOperations.includes(op)) {
      setError(`❌ Access Denied — ${user?.role} cannot ${op}`);
      return;
    }
    setOperand1(parseFloat(display));
    setOperation(op);
    setWaitingForOperand2(true);
  };

  const handleCalculate = async () => {
    if (operand1 === null || !operation || !user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CALCULATOR_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "calculate",
          role: user.role,
          operand1: operand1,
          operand2: parseFloat(display),
          operation,
          userId: user.userId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.allowed) {
        setDisplay(String(data.result));
        setOperand1(null);
        setOperation(null);
        fetchHistory(user.userId);
      } else {
        setError(data.error || "Calculation failed!");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setOperand1(null);
    setOperation(null);
    setWaitingForOperand2(false);
    setError("");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const isOperationAllowed = (op: string) => allowedOperations.includes(op);

  return (
    <main className="min-h-screen bg-slate-900 p-6">

      {/* Navbar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <span className="text-white font-bold text-xl">RBAC Calculator</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="bg-slate-800 px-4 py-2 rounded-xl">
              <span className="text-slate-400 text-sm">Logged in as </span>
              <span className="text-white font-semibold">{user.email}</span>
              <span className="ml-2 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>
          )}
          {user?.role === "Admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-600"
            >
              ⚙️ Admin
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-900 text-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">

        {/* Calculator */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">

          {/* Role indicator */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Calculator</h2>
            <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">
              {user?.role} — {allowedOperations.join(", ")}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Display */}
          <div className="bg-slate-900 rounded-xl p-4 mb-4 text-right">
            {operation && (
              <p className="text-slate-500 text-sm">
                {operand1} {operationSymbols[operation]}
              </p>
            )}
            <p className="text-white text-4xl font-bold truncate">
              {display}
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">

            {/* Row 1 */}
            <button
              onClick={handleClear}
              className="col-span-2 bg-red-800 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              AC
            </button>
            <button
              onClick={() => setDisplay(display.slice(0, -1) || "0")}
              className="bg-slate-600 text-white py-4 rounded-xl font-bold hover:bg-slate-500 transition-all"
            >
              ⌫
            </button>
            <button
              onClick={() => handleOperation("divide")}
              disabled={!isOperationAllowed("divide")}
              className={`py-4 rounded-xl font-bold text-xl transition-all ${
                isOperationAllowed("divide")
                  ? "bg-slate-600 text-white hover:bg-white hover:text-slate-900"
                  : "bg-slate-700 text-slate-600 cursor-not-allowed"
              } ${operation === "divide" ? "bg-white text-slate-900" : ""}`}
            >
              ÷
            </button>

            {/* Row 2 */}
            {["7", "8", "9"].map((num) => (
              <button
                key={num}
                onClick={() => handleNumber(num)}
                className="bg-slate-700 text-white py-4 rounded-xl font-bold text-xl hover:bg-slate-600 transition-all"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation("multiply")}
              disabled={!isOperationAllowed("multiply")}
              className={`py-4 rounded-xl font-bold text-xl transition-all ${
                isOperationAllowed("multiply")
                  ? "bg-slate-600 text-white hover:bg-white hover:text-slate-900"
                  : "bg-slate-700 text-slate-600 cursor-not-allowed"
              } ${operation === "multiply" ? "bg-white text-slate-900" : ""}`}
            >
              ×
            </button>

            {/* Row 3 */}
            {["4", "5", "6"].map((num) => (
              <button
                key={num}
                onClick={() => handleNumber(num)}
                className="bg-slate-700 text-white py-4 rounded-xl font-bold text-xl hover:bg-slate-600 transition-all"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation("subtract")}
              disabled={!isOperationAllowed("subtract")}
              className={`py-4 rounded-xl font-bold text-xl transition-all ${
                isOperationAllowed("subtract")
                  ? "bg-slate-600 text-white hover:bg-white hover:text-slate-900"
                  : "bg-slate-700 text-slate-600 cursor-not-allowed"
              } ${operation === "subtract" ? "bg-white text-slate-900" : ""}`}
            >
              −
            </button>

            {/* Row 4 */}
            {["1", "2", "3"].map((num) => (
              <button
                key={num}
                onClick={() => handleNumber(num)}
                className="bg-slate-700 text-white py-4 rounded-xl font-bold text-xl hover:bg-slate-600 transition-all"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation("add")}
              disabled={!isOperationAllowed("add")}
              className={`py-4 rounded-xl font-bold text-xl transition-all ${
                isOperationAllowed("add")
                  ? "bg-slate-600 text-white hover:bg-white hover:text-slate-900"
                  : "bg-slate-700 text-slate-600 cursor-not-allowed"
              } ${operation === "add" ? "bg-white text-slate-900" : ""}`}
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleNumber("0")}
              className="bg-slate-700 text-white py-4 rounded-xl font-bold text-xl hover:bg-slate-600 transition-all"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="bg-slate-700 text-white py-4 rounded-xl font-bold text-xl hover:bg-slate-600 transition-all"
            >
              .
            </button>
            <button
              onClick={handleCalculate}
              disabled={loading || !operation}
              className="col-span-2 bg-white text-slate-900 py-4 rounded-xl font-bold text-xl hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              {loading ? "..." : "="}
            </button>

          </div>
        </div>

        {/* History Panel */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">
              📋 Calculation History
            </h2>
            <button
              onClick={() => user && fetchHistory(user.userId)}
              className="text-slate-400 text-sm hover:text-white"
            >
              🔄 Refresh
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              <p className="text-3xl mb-2">🧮</p>
              <p>No calculations yet!</p>
              <p className="text-sm mt-1">
                Start calculating to see history
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-96">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-700 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold">
                      {item.operand1} {operationSymbols[item.operation]} {item.operand2} = {item.result}
                    </p>
                    <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                      {item.role_used}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}