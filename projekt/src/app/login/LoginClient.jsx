// app/login/LoginClient.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function LoginClient() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const safeNext = useMemo(() => {
    if (typeof nextParam === "string" && nextParam.startsWith("/")) return nextParam;
    return "/profile";
  }, [nextParam]);

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setMsg({ type: "", text: "" });

    if (!isEmail(form.email)) {
      setMsg({ type: "error", text: "Please enter a valid email." });
      return;
    }
    if (!form.password.trim()) {
      setMsg({ type: "error", text: "Password is required." });
      return;
    }

    setLoading(true);
    try {
      await signIn(form.email, form.password);
      setMsg({ type: "success", text: "Welcome back!" });
      router.replace(safeNext);
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!msg.text) return;
    const t = setTimeout(() => setMsg({ type: "", text: "" }), 5000);
    return () => clearTimeout(t);
  }, [msg.text]);

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>

      <form className="space-y-4 rounded-2xl border bg-white p-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="login-email"
            name="email"
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium mb-1">Password</label>
          <input
            id="login-password"
            name="password"
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {msg.text && (
          <p
            role="status"
            className={`text-sm ${msg.type === "error" ? "text-red-600" : "text-green-700"}`}
          >
            {msg.text}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-disabled="true"
          className="font-semibold text-black cursor-default"
        >
          Forgot password?
        </a>
      </p>
    </div>
  );
}
