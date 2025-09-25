"use client";
import { useState } from "react";
import { authFetch, getUserId } from "@/lib/apiClient";

export default function ProposeButton({ listingId }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function propose() {
    setMsg("");
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) throw new Error("Please sign in first.");

      const body = new URLSearchParams({
        userid: String(userId),
        requestItem: String(listingId),
       
        offerItem: String(listingId),
      });

      const res = await authFetch("/api/v1/requests", { method: "POST", body });
      if (!res.ok) throw new Error("Could not send request");
      setMsg("Request sent!");
    } catch (e) {
      setMsg(e.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={propose}
        disabled={loading}
        className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Propose a swap"}
      </button>
      {msg && <span className="text-sm text-green-700">{msg}</span>}
    </div>
  );
}
