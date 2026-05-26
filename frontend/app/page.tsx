"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
        }),
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

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/approve-report",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      alert(data.message);

    } catch (error) {

      console.error(error);

      alert("Approval workflow failed.");
    }
  };

  const riskColor =
    results?.risk_score > 80
      ? "text-red-500"
      : results?.risk_score > 50
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          ShadowTrace Agent
        </h1>

        <p className="text-gray-400 mb-10">
          AI-powered cybersecurity exposure investigation platform.
        </p>

        <div className="bg-zinc-900 p-6 rounded-2xl mb-8 border border-zinc-800">

          <h2 className="text-2xl font-semibold mb-4">
            Start Exposure Scan
          </h2>

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
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Agent Investigating..." : "Start Scan"}
          </button>

          {loading && (
            <div className="mt-6 bg-zinc-950 p-5 rounded-xl border border-zinc-800">

              <p className="animate-pulse text-green-400">
                ShadowTrace Agent is analyzing digital exposure...
              </p>

              <div className="mt-4 space-y-2 text-gray-400">
                <p>✓ Planning investigation</p>
                <p>✓ Checking breach exposure</p>
                <p>✓ Investigating username reuse</p>
                <p>✓ Calculating cybersecurity risk</p>
                <p>✓ Generating remediation workflow</p>
              </div>

            </div>
          )}

        </div>

        {results && (
          <div className="space-y-6">

            <div className="grid grid-cols-3 gap-6">

              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

                <h3 className="text-gray-400 mb-2">
                  Breaches Found
                </h3>

                <p className="text-4xl font-bold">
                  {results.breaches_found}
                </p>

              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

                <h3 className="text-gray-400 mb-2">
                  Reused Accounts
                </h3>

                <p className="text-4xl font-bold">
                  {results.reused_accounts}
                </p>

              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

                <h3 className="text-gray-400 mb-2">
                  Risk Score
                </h3>

                <p className={`text-4xl font-bold ${riskColor}`}>
                  {results.risk_score}/100
                </p>

              </div>

            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

              <h2 className="text-2xl font-semibold mb-4">
                Exposed Services
              </h2>

              <div className="flex gap-3 flex-wrap">

                {results.services.map(
                  (service: string, index: number) => (

                    <span
                      key={index}
                      className="bg-red-600 px-4 py-2 rounded-full"
                    >
                      {service}
                    </span>

                  )
                )}

              </div>

            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
                AI Security Analysis
              </h2>

              <p className="text-gray-300 whitespace-pre-line leading-7">
                {results.ai_analysis}
              </p>

            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

              <h2 className="text-2xl font-semibold mb-4">
                Recommendations
              </h2>

              <ul className="space-y-2">

                {results.recommendations.map(
                  (item: string, index: number) => (

                    <li key={index}>
                      • {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

              <h2 className="text-2xl font-semibold mb-4">
                Agent Timeline
              </h2>

              <ul className="space-y-3">

                {results.agent_steps.map(
                  (step: string, index: number) => (

                    <li key={index}>
                      ✓ {step}
                    </li>

                  )
                )}

              </ul>

            </div>

            <button
              onClick={approveReport}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
            >
              Approve Remediation Report
            </button>

          </div>
        )}

      </div>
    </main>
  );
}