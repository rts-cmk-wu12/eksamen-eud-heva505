"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { withParams } from "@/lib/buildQuery";

const options = [
  { key: "new", label: "New" },
  { key: "price_asc", label: "Price ascending" },
  { key: "price_desc", label: "Price descending" },
];

export default function SortChips() {
  const sp = useSearchParams();
  const router = useRouter();
  const current = sp.get("sort") || "new";

  function setSort(key) {
    const qs = withParams("?" + sp.toString(), { sort: key, page: 1 });
    router.push("/" + qs);
  }

  return (
    <div className="flex items-center gap-2">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => setSort(o.key)}
          className={`rounded-full px-3 py-1.5 text-sm border transition ${
            current === o.key ? "bg-black text-white border-black" : "hover:bg-gray-50"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
