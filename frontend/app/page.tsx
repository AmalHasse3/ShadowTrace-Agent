"use client";

import { useState } from "react";

type ScanResult = {
  email: string;
  username: string;
  breaches_found: number;
  services: string[];
  exposed_data: string[];
  first_breach_year: number | null;
  reused_accounts: number;
  platforms_found: string[];
  platforms_checked: string[];
  username_risk_level: string;
  risk_score: number;
  security_status: string;
  ai_analysis: string;
  recommendations: string[];
  agent_steps: string[];
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const startScan = async () => {
    if (!email || !username) {
      alert("Please enter both an email and a username.");
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const response = await fetch(`${API_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
    setLoading(false);
  };

  const approveReport = async () => {
    setApproving(true);
    try {
      const response = await fetch(`${API_URL}/approve-report`, { method: "POST" });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Approval workflow failed.");
    }
    setApproving(false);
  };

  const riskColor = (score: number) =>
    score > 80 ? "text-red-500"
    : score > 50 ? "text-yellow-400"
    : score > 20 ? "text-blue-400"
    : "text-green-400";

  const statusBadge = (status: string) => {
    if (status.includes("HIGH")) return "bg-red-900 text-red-200 border-red-700";
    if (status.includes("MEDIUM")) return "bg-yellow-900 text-yellow-200 border-yellow-700";
    if (status.includes("LOW")) return "bg-blue-900 text-blue-200 border-blue-700";
    return "bg-green-900 text-green-200 border-green-700";
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">ShadowTrace Agent</h1>
        <p className="text-gray-400 mb-10">
          AI-powered cybersecurity exposure investigation platform.
        </p>

        <div className="bg-zinc-900 p-6 rounded-2xl mb-8 border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">Start Exposure Scan</h2>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter username"
            className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={startScan}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 transition py-3 rounded-lg font-semibold"
          >
            {loading ? "Scanning... (this can take a few seconds)" : "Run Scan"}
          </button>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <div className="text-sm text-gray-400">Risk Score</div>
                  <div className={`text-7xl font-bold ${riskColor(results.risk_score)}`}>
                    {results.risk_score}
                    <span className="text-2xl text-gray-500">/100</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border font-semibold ${statusBadge(results.security_status)}`}>
                  {results.security_status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-sm text-gray-400">Breaches Found</div>
                <div className="text-4xl font-bold">{results.breaches_found}</div>
              </div>
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-sm text-gray-400">Platforms with Username</div>
                <div className="text-4xl font-bold">
                  {results.reused_accounts}
                  <span className="text-lg text-gray-500"> / {results.platforms_checked.length}</span>
                </div>
              </div>
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-sm text-gray-400">Username Risk</div>
                <div className="text-4xl font-bold capitalize">{results.username_risk_level}</div>
              </div>
            </div>

            {results.breaches_found > 0 && (
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Breach Exposure</h3>
                <div className="mb-3">
                  <div className="text-sm text-gray-400 mb-2">Affected Services</div>
                  <div className="flex flex-wrap gap-2">
                    {results.services.map((s) => (
                      <span key={s} className="px-3 py-1 bg-red-950 border border-red-800 rounded-full text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {results.exposed_data.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-2">Data Types Exposed</div>
                    <div className="flex flex-wrap gap-2">
                      {results.exposed_data.map((d) => (
                        <span key={d} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {results.first_breach_year && (
                  <div className="text-sm text-gray-400">
                    Earliest known breach:{" "}
                    <span className="text-white font-semibold">{results.first_breach_year}</span>
                  </div>
                )}
              </div>
            )}

            {results.platforms_found.length > 0 && (
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Username Footprint</h3>
                <div className="text-sm text-gray-400 mb-2">
                  &ldquo;{results.username}&rdquo; was found on:
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {results.platforms_found.map((p) => (
                    <span key={p} className="px-3 py-1 bg-orange-950 border border-orange-800 rounded-full text-sm">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Platforms checked: {results.platforms_checked.join(", ")}
                </div>
              </div>
            )}

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {results.ai_analysis}
              </pre>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
              <ul className="space-y-2">
                {results.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-blue-400 font-bold">{i + 1}.</span>
                    <span className="text-gray-200">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-xl font-semibold mb-4">Agent Workflow</h3>
              <ol className="space-y-2">
                {results.agent_steps.map((s, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <span className="w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center font-bold">
                      ✓
                    </span>
                    <span className="text-gray-300">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={approveReport}
              disabled={approving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 transition py-3 rounded-lg font-semibold"
            >
              {approving ? "Generating report..." : "Approve & Generate Report"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
