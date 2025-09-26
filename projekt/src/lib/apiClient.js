

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";


// Hjælpefunktioner: opbygning af URLs + læsning af serverfejl

function makeURL(path, params = {}) {
  const url = new URL(path, BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "")
      url.searchParams.set(k, String(v));
  });
  return url.toString();
}

//safeError: forsøger at udtrække en forståelig fejlbesked fra et Response.
async function safeError(res) {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();
      return (
        j?.message || j?.error || j?.errors?.[0]?.message || JSON.stringify(j)
      );
    } else {
      const t = await res.text();
      return t?.slice(0, 500);
    }
  } catch {
    return null;
  }
}

// Autentikationshjælpere til localStorage

export const TOKEN_KEY = "swaphub_token";
export const USER_ID_KEY = "swaphub_user_id";

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function setUserId(id) {
  try {
    localStorage.setItem(USER_ID_KEY, String(id));
  } catch {}
}
export function getUserId() {
  try {
    return localStorage.getItem(USER_ID_KEY) || null;
  } catch {
    return null;
  }
}
export function clearUserId() {
  try {
    localStorage.removeItem(USER_ID_KEY);
  } catch {}
}

// Fetch-wrapper der tilføjer token og sætter headers

export async function authFetch(path, opts = {}) {
  const token = getToken();

  const headers = new Headers(opts.headers || {});
  const body = opts.body;
  const isForm =
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams);

  if (!headers.has("Content-Type") && !isForm && typeof body === "string") {
    headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path.startsWith("http") ? path : makeURL(path), {
    ...opts,
    headers,
    cache: "no-store",
  });
  return res;
}

// Auth-endpoints (login, registrering, min profil, opdatering, skift kodeord, logout)

export async function apiLogin(email, password) {
  const emailClean = String(email || "").trim().toLowerCase();
 const passClean  = String(password || "").trim();
 if (!emailClean || !passClean) {
    throw new Error("Please enter email and password.");
  }

  const body = new URLSearchParams();
  body.set("email", emailClean);
  body.set("password", passClean);

  body.set("username", emailClean);

  const res = await fetch(makeURL("/auth/token"), { method: "POST", body });

  if (!res.ok) {
    let serverMsg = "Invalid email or password";
    try {
    const ct = res.headers.get("content-type") || "";
      serverMsg = ct.includes("application/json")
        ? (await res.json())?.error || serverMsg
        : (await res.text()) || serverMsg;
    } catch {}
    throw new Error(serverMsg);
  }

  const data = await res.json();

 const token = data?.token || data?.accessToken || data?.jwt;
  if (token) setToken(token);

  const userId = data?.user?.id ?? data?.userId ?? data?.id;
  if (userId) setUserId(userId);

  return data;
}

export async function apiRegister({ email, password, firstName, lastName }) {
  const payload = new URLSearchParams({
    email: String(email || "").trim().toLowerCase(),
    password: String(password || "").trim(),
    firstname: String(firstName || "").trim(),
    lastname: String(lastName || "").trim(),
  });

  const res = await fetch(makeURL("/api/v1/users"), { method: "POST", body: payload });
  if (!res.ok) {
    const msg = await safeError(res);
    throw new Error(msg || "Registration failed");
  }
  const data = await res.json();

  const token = data?.token || data?.accessToken || data?.jwt;
  if (token) setToken(token);

  const newUserId = data?.user?.id ?? data?.id;
  if (newUserId) setUserId(newUserId);

  return data;
}

export async function apiGetMe() {
  const id = getUserId();
  if (!id) throw new Error("Missing user id");
  const res = await authFetch(`/api/v1/users/${id}`, { method: "GET" });
  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      clearUserId();
    }
    const msg = await safeError(res);
    throw new Error(msg || "Failed to fetch profile");
  }
  const me = await res.json();
  const uid = me?.id ?? me?._id;
  if (uid) setUserId(uid);
  return me;
}

export async function apiUpdateProfile({
  email,
  firstName,
  lastName,
  password,
}) {
  const id = getUserId();
  if (!id) throw new Error("Missing user id");

  const form = new URLSearchParams({
    email: email ?? "",
    firstname: firstName ?? "",
    lastname: lastName ?? "",
  });

  if (typeof password === "string" && password.trim() !== "") {
    form.set("password", password.trim());
  } else {
    throw new Error("Please enter your password to save account changes.");
  }

  const res = await authFetch(`/api/v1/users/${id}`, {
    method: "PUT",
    body: form,
  });

  if (!res.ok) {
    const msg = await safeError(res);
    throw new Error(msg || "Failed to update profile");
  }
  return await res.json();
}

export async function apiChangePassword({ password }) {
  const id = getUserId();
  if (!id) throw new Error("Missing user id");

  const body = new URLSearchParams({ password });

  const res = await authFetch(`/api/v1/users/${id}`, {
    method: "PUT",
    body,
  });
  if (!res.ok) {
    const msg = await safeError(res);
    throw new Error(msg || "Failed to change password");
  }
  return await res.json();
}

export async function apiLogout() {
  clearToken();
  clearUserId();
  return true;
}

// Listings: alle elementer, paginering, efter ID, efter bruger

export async function fetchListings(params = {}) {
  const res = await fetch(makeURL("/api/v1/listings", params), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not fetch listings");
  const data = await res.json();
  return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (Array.isArray(data?.rows) ? data.rows : []));
}


export async function fetchListingsPaged({ page = 1, limit = 6, search = "" } = {}) {
  
  const params = { page, limit };
  if (search) params.search = search;

  const res = await fetch(makeURL("/api/v1/listings", params), { cache: "no-store" });
  if (!res.ok) throw new Error("Could not fetch listings");
  const data = await res.json();

 
  if (data && Array.isArray(data.data) && data.meta) {
    const total = data.meta.total ?? data.data.length;
    const totalPages =
      data.meta.totalPages ?? Math.max(1, Math.ceil(total / (data.meta.limit ?? limit)));
    return {
      items: data.data,
      total,
      totalPages,
      page: data.meta.page ?? page,
      perPage: data.meta.limit ?? limit,
    };
  }

  
  if (data && Array.isArray(data.rows) && typeof data.count === "number") {
    const total = data.count;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items: data.rows, total, totalPages, page, perPage: limit };
  }


  if (Array.isArray(data)) {
    const all = data;

    
    const hinted = Number(res.headers.get("x-total-count"));
    const total = Number.isFinite(hinted) && hinted > 0 ? hinted : all.length;

    
    const q = search.trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (it) =>
            (it?.title || "").toLowerCase().includes(q) ||
            (it?.description || "").toLowerCase().includes(q)
        )
      : all;

    const totalAfter = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalAfter / limit));
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total: totalAfter, totalPages, page, perPage: limit };
  }

  // fallback 
  return { items: [], total: 0, totalPages: 1, page, perPage: limit };
}


export async function fetchAllListings() {
  return await fetchListings();
}

export async function fetchListingById(id) {
  const res = await fetch(makeURL(`/api/v1/listings/${id}`), {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function fetchListingsByUser(userId) {
  if (!userId) return [];
  return await fetchListings({ userId });
}
// Newsletter-endpoint

export async function apiNewsletterSubscribe(email) {
  const body = new URLSearchParams({ email: String(email || "").trim() });

  const res = await fetch(makeURL("/api/v1/newsletter"), {
    method: "POST",
    body,
  });

  if (!res.ok) {
    const msg = await safeError(res);
    throw new Error(msg || "Subscription failed");
  }

  return { success: true };
}
