"use client";

import { useState } from "react";
import  Link from "next/link";
import { apiRegister, apiLogin } from "@/lib/apiClient";

const isEmail = (v) =>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function RegisterPage() {
    const [form, setForm] = useState({
        firstName : "", lastName : "", email : "", password : "", confirm : "", });

        const [loading, setLoading] = useState(false);
        const [msg, setMsg] = useState({ type : "", text : "", });

    async function onSubmit(e) {
        e.preventDefault();
        setMsg({ type : "", text : "", });

        if (!form.firstName.trim()) return setMsg({ type : "error", text : "First name is required", });
        if (!form.lastName.trim()) return setMsg({ type : "error", text : "Last name is required", });
        if (!isEmail(form.email)) return setMsg({ type : "error", text : "Please enter a valid email", });
        if (form.password.length < 6) return setMsg({ type : "error", text : "Password must be at least 6 characters", });
        if (form.password !== form.confirm) return setMsg({ type : "error", text : "Passwords do not match", });
        setLoading(true);

        try {
            await apiRegister({
                firstName : form.firstName,
                lastName : form.lastName,
                email : form.email,
                password : form.password,
            });

            try {await apiLogin({
                email : form.email,
                password : form.password,
            }); } catch {}

            setMsg({ type : "success", text : "Account created.Welcome!", });
            window.location.href = "/profile";
            } catch (err) {
                setMsg({ type : "error", text : err?.messag || "Registration failed" });
            }
            finally {
                setLoading(false);
            }
    }
    return (
        <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-6">Create account</h1>
            <form className="space-y-4 rounded-2xl border bg-white p-6 "onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="reg-firstname" className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          id="reg-firstname"
                          name="firstName"
                          className="input"
                          value={form.firstName}
                          onChange={(e) => setForm((s) => ({ ...s, firstName : e.target.value }))}  />
                    </div>
                    <div>
                        <label htmlFor="reg-lastname" className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          id="reg-lastname"
                          name="lastName"
                          className="input"
                          value={form.lastName}
                          onChange={(e) => setForm((s) => ({ ...s, lastName : e.target.value }))}  />
                    </div>
                    </div>
                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="reg-email"
                      name="email"
                      className="input"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email : e.target.value }))}  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                      id="reg-password"
                      name="password"
                      className="input"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((s) => ({ ...s, password : e.target.value }))}  />
                </div>
                <div>
                    <label htmlFor="reg-confirm" className="block text-sm font-medium mb-1">Confirm password </label>
                     <input
                       id="reg-confirm"
                       name="confirm"
                       className="input"
                       type="password"
                       value={form.confirm}
                       onChange={(e) => setForm((s) => ({ ...s, confirm : e.target.value }))}  />
                </div>
                </div>
     {msg.text && <p className={
        `text-sm ${msg.type === "erro" ? "text-red-600" : "text-green-700"}`}> {msg.text} </p>}           
        <button type="submit" disabled={loading} className="btn btn-primary w-full disbled:opacity-50">
            {loading? "Creating.." : "Create account"}

        </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
            Already have an account? <Link href="/login" className="underline">sign in</Link>
        </p>
        </div>
    );
}
