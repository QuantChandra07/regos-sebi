"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [useMockAI, setUseMockAI] = useState(true);
  const [orgName, setOrgName] = useState("Apex Capital Broking Pvt. Ltd.");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="mt-0.5 font-mono text-xs text-gray-400">
          Organization, AI, and integration configuration
        </p>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-200">Organization</h3>
        <label className="text-[10px] font-mono uppercase text-gray-500">
          Entity Name
        </label>
        <input
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-800 bg-background/80 px-3 py-2 text-xs text-gray-200"
        />
        <p className="mt-2 text-[10px] text-gray-500">
          Intermediary type: Stockbroker · Registration: INZ000123456
        </p>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-200">AI Configuration</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-200">Use Mocked AI</p>
            <p className="text-[10px] text-gray-500">
              Disable to route to real OpenAI/Claude/Gemini + RAG pipeline
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUseMockAI(!useMockAI)}
            className={`relative h-5 w-10 rounded-full transition-colors ${
              useMockAI ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                useMockAI ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-200">First Target Corpus</h3>
        <ul className="space-y-1 text-xs text-gray-400">
          <li>• SEBI Master Circular for Stockbrokers</li>
          <li>• SEBI Master Circular for Investment Advisers</li>
        </ul>
      </Card>

      <Button>Save Changes</Button>
    </div>
  );
}