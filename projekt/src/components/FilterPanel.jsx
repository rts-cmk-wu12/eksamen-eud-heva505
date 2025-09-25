"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { withParams } from "@/lib/buildQuery";

const KEYWORDS = ["Spring", "Smart", "Modern"];
const COLORS = ["Black", "White", "Gray"];
const SIZES = ["S", "M", "L"];
const LABELS = ["Label 1", "Label 2", "Label 3"];

export default function FilterPanel() {
  const router = useRouter();
  const sp = useSearchParams();

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [price, setPrice] = useState(100);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    setSelectedKeywords((sp.get("keywords") || "").split(",").filter(Boolean));
    setPrice(Number(sp.get("price") || 100));
    setColors((sp.get("colors") || "").split(",").filter(Boolean));
    setSizes((sp.get("sizes") || "").split(",").filter(Boolean));
    setLabels((sp.get("labels") || "").split(",").filter(Boolean));
  }, [sp]);

  function updateParam(name, value) {
    const current = "?" + sp.toString();
    const next = withParams(current, { [name]: value || null, page: 1 });
    router.push("/" + next);
  }

  function toggleMulti(list, value, setter, keyName) {
    const has = list.includes(value);
    const next = has ? list.filter((v) => v !== value) : [...list, value];
    setter(next);
    updateParam(keyName, next.join(","));
  }

  function removeKeyword(kw) {
    const next = selectedKeywords.filter((k) => k !== kw);
    setSelectedKeywords(next);
    updateParam("keywords", next.join(","));
  }

  function addKeyword(kw) {
    if (selectedKeywords.includes(kw)) return;
    const next = [...selectedKeywords, kw];
    setSelectedKeywords(next);
    updateParam("keywords", next.join(","));
  }

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="rounded-2xl border p-4">
        <h3 className="font-medium mb-3">Keywords</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {selectedKeywords.length === 0 && (
            <span className="text-sm text-gray-500">No keywords</span>
          )}
          {selectedKeywords.map((kw) => (
            <button
              key={kw}
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs hover:bg-gray-50"
              onClick={() => removeKeyword(kw)}
              title="Remove"
            >
              {kw} ✕
            </button>
          ))}
        </div>

     
        <div className="flex flex-wrap gap-2 mb-6">
          {KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => addKeyword(kw)}
              className="text-xs rounded-full border px-2 py-0.5 hover:bg-gray-50"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Label */}
        <Group title="Label">
          <ul className="space-y-2">
            {LABELS.map((l) => (
              <li key={l} className="flex items-start gap-2">
                <input
                  id={`label-${l}`}
                  name="labels"
                  type="checkbox"
                  checked={labels.includes(l)}
                  onChange={() => toggleMulti(labels, l, setLabels, "labels")}
                />
                <label htmlFor={`label-${l}`} className="text-sm leading-4">
                  <div>Label</div>
                  <div className="text-gray-500 text-xs">Description</div>
                </label>
              </li>
            ))}
          </ul>
        </Group>

        {/* Price */}
        <Group title="Label" right="$0–100">
          <input
            id="price-range"
            name="price"
            type="range"
            min={0}
            max={100}
            step={1}
            value={price}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPrice(v);
              updateParam("price", v);
            }}
            className="w-full accent-black"
          />
        </Group>

        {/* Color */}
        <Group title="Color">
          <ul className="space-y-2">
            {COLORS.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <input
                  id={`color-${c}`}
                  name="colors"
                  type="checkbox"
                  checked={colors.includes(c)}
                  onChange={() => toggleMulti(colors, c, setColors, "colors")}
                />
                <label htmlFor={`color-${c}`} className="text-sm">
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </Group>

        {/* Size */}
        <Group title="Size">
          <ul className="space-y-2">
            {SIZES.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <input
                  id={`size-${s}`}
                  name="sizes"
                  type="checkbox"
                  checked={sizes.includes(s)}
                  onChange={() => toggleMulti(sizes, s, setSizes, "sizes")}
                />
                <label htmlFor={`size-${s}`} className="text-sm">
                  {s}
                </label>
              </li>
            ))}
          </ul>
        </Group>
      </div>
    </aside>
  );
}

function Group({ title, right, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        {right && <span className="text-xs text-gray-500">{right}</span>}
      </div>
      {children}
    </div>
  );
}
