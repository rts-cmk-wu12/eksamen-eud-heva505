  
export function withParams(current, nextParams = {}) {
  const url = new URL(current, "http://example.com");
  const sp = url.searchParams;
  Object.entries(nextParams).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") sp.delete(k);
    else sp.set(k, String(v));
  });
  
  const path = url.pathname + (sp.toString() ? `?${sp.toString()}` : "");
  return path;
}
