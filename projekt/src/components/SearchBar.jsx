"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { withParams } from "@/lib/buildQuery";

export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(sp.get("search") || "");
  }, [sp]);

  function onSubmit(e) {
    e.preventDefault();
    const newQs = withParams("?" + sp.toString(), { search: q || null, page: 1 });
    router.push("/" + newQs);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md">
     
      <label htmlFor="search-input" className="sr-only">Search</label>

      <input
        id="search-input"
        name="search"
        autoComplete="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="w-full rounded-full border px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-black/10"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
      >
        🔍
      </button>
    </form>
  );
}
