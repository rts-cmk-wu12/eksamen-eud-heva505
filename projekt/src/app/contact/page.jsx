"use client";

import { useState } from "react";
import { apiNewsletterSubscribe } from "@/lib/apiClient";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function Contactpage() {
  // contact form
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [cLoading, setCLoading] = useState(false);
  const [cMsg, setCMsg] = useState({ type: "", text: "" });

  // newsletter
  const [newsEmail, setNewsEmail] = useState("");
  const [nLoading, setNLoading] = useState(false);
  const [nMsg, setNMsg] = useState({ type: "", text: "" });

  async function submitContact(e) {
    e.preventDefault();
    setCMsg({ type: "", text: "" });

    // simple validation
    if (!contact.name.trim())
      return setCMsg({ type: "error", text: "please enter your name" });
    if (!isEmail(contact.email))
      return setCMsg({ type: "error", text: "please enter a valid email" });
    if (contact.message.trim().length < 10)
      return setCMsg({
        type: "error",
        text: "message should be at least 10 characters",
      });
    setCLoading(true);
    try {
      setCMsg({
        type: "success",
        text: "Thank you for your message! We will get back to you soon.",
      });
      setContact({ name: "", email: "", message: "" });
    } catch {
      setCMsg({
        type: "error",
        text: "faild to send message, please try again later.",
      });
    } finally {
      setCLoading(false);
    }
  }
  async function submitNewsletter(e) {
    e.preventDefault();
    setNMsg({ type: "", text: "" });
    if (!isEmail(newsEmail))
      return setNMsg({ type: "error", text: "please enter a valid email" });
    setNLoading(true);
    try {
      //
      await apiNewsletterSubscribe(newsEmail);
      setNMsg({
        type: "success",
        text: "Thank you for subscribing to our newsletter!",
      });
      setNewsEmail("");
    } catch (err) {
      setNMsg({
        type: "error",
        text: err?.message || "faild to subscribe, please try again later.",
      });
    } finally {
      setNLoading(false);
    }
  }
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Contact Us</h1>
        <p className="text-gray-600">
          {" "}
          Question, feedback, or partnership ideas? We'd love to hear from you!{" "}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* left: contact form */}
        <section className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Send us a message</h2>
            <form className="space-y-4" onSubmit={submitContact}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    className="input"
                    value={contact.name}
                    onChange={(e) =>
                      setContact((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    className="input"
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="input"
                  rows={6}
                  value={contact.message}
                  onChange={(e) =>
                    setContact((s) => ({ ...s, message: e.target.value }))
                  }
                  placeholder="Tell us how we can help"
                />
              </div>
              {cMsg.text && (
                <p
                  className={`text-sm ${
                    cMsg.type === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {cMsg.text}
                </p>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={cLoading}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {cLoading ? "Sending..." : "Send Message"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setContact({ name: "", email: "", message: "" });
                    setCMsg({ type: "", text: "" });
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* right:newsletter*/}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-medium mb-2">Newsletter</h2>
            <p className="text-sm text-gray-600 mb-4">
              Stay updated with our latest news and offers. Subscribe to our
              newsletter!
            </p>
            <form className="space-y-3" onSubmit={submitNewsletter}>
              <label
                htmlFor="newsletter-email"
                className="block text-sm font-medium"
              >
                Email
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="newsletter-email"
                  name="newsletterEmail"
                  className="input flex-1"
                  type="email"
                  value={newsEmail}
                  placeholder="you@example.com"
                  onChange={(e) => setNewsEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={nLoading}
                  className="btn btn-default disabled:opacity-50"
                >
                  {nLoading ? "Joining..." : "Join"}
                </button>
              </div>

              {nMsg.text && (
                <p
                  className={`text-sm ${
                    nMsg.type === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {nMsg.text}
                </p>
              )}
            </form>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p>
                Prefer email?{" "}
                <span className="text-gray-900">support@swaphub.local</span>
              </p>
              <p>Follow us on social for updates</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
