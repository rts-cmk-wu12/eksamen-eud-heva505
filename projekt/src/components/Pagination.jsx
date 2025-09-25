/*pagination*/

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { withParams } from "@/lib/buildQuery";


export default function Pagination({ page, perPage, total }) {
  const router = useRouter();
  const sp = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function go(to) {
    const qs = withParams("?" + sp.toString(), { page: to });
    router.push("/" + qs);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  
  return (
    <div className="mt-8 flex items-center justify-center gap-3 text-sm">
      <button
        className="rounded border px-3 py-1.5 disabled:opacity-40"
        disabled={!canPrev}
        onClick={() => go(page - 1)}
      >
        ← Previous
      </button>

      <span className="px-2">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </span>

      <button
        className="rounded border px-3 py-1.5 disabled:opacity-40"
        disabled={!canNext}
        onClick={() => go(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
