
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* Utils */
function makeURL(path, params = {}) {
  const url = new URL(path, BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

async function safeError(res) {
  try {
    const ct = res.headers?.get?.("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();
      return j?.message || j?.error || j?.errors?.[0]?.message || JSON.stringify(j);
    } else {
      const t = await res.text();
      return t?.slice(0, 500);
    }
  } catch {
    return null;
  }
}

/* Token & userId storage */
export const TOKEN_KEY = "swaphub_token";
export const USER_ID_KEY = "swaphub_user_id";

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, String(token));
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

/* authFetch */
export async function authFetch(path, opts = {}) {
  const token = getToken();
  const init = { ...opts };
  const hdrs = new Headers(init.headers || {});

  const body = init.body;
  const isForm =
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams);

  if (!hdrs.has("Content-Type") && !isForm && typeof body === "string") {
    hdrs.set("Content-Type", "application/json");
  }
  if (token) hdrs.set("Authorization", `Bearer ${token}`);

  init.headers = hdrs;

  const url = path.startsWith("http") ? path : makeURL(path);
  const res = await fetch(url, { ...init, cache: "no-store" });
  return res;
}

/* Auth */
export async function apiLogin(email, password) {
  const emailClean = String(email || "").trim().toLowerCase();
  const passClean  = String(password || "").trim();
  if (!emailClean || !passClean) throw new Error("Please enter email and password.");

  const body = new URLSearchParams({ email: emailClean, password: passClean, username: emailClean });
  const res = await fetch(makeURL("/auth/token"), { method: "POST", body });

  if (!res.ok) {
    let serverMsg = "Invalid email or password";
    try {
      const ct = res.headers.get("content-type") || "";
      serverMsg = ct.includes("application/json") ? (await res.json())?.error || serverMsg : (await res.text()) || serverMsg;
    } catch {}
    throw new Error(serverMsg);
  }

  const data  = await res.json();
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
  const data  = await res.json();
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
  const me  = await res.json();
  const uid = me?.id ?? me?._id;
  if (uid) setUserId(uid);
  return me;
}

export async function apiUpdateProfile({ email, firstName, lastName, password }) {
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

  const res = await authFetch(`/api/v1/users/${id}`, { method: "PUT", body: form });
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
  const res = await authFetch(`/api/v1/users/${id}`, { method: "PUT", body });
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

/* Listings */
export async function fetchListings(params = {}) {
  const res = await fetch(makeURL("/api/v1/listings", params), { cache: "no-store" });
  if (!res.ok) throw new Error("Could not fetch listings");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchListingById(id) {
  const res = await fetch(makeURL(`/api/v1/listings/${id}`), { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export async function fetchListingsByUser(userId) {
  if (!userId) return [];
  return await fetchListings({ userId });
}

export async function apiNewsletterSubscribe(email) {
  const body = new URLSearchParams({ email: String(email || "").trim() });
  const res = await fetch(makeURL("/api/v1/newsletter"), { method: "POST", body });
  if (!res.ok) {
    const msg = await safeError(res);
    throw new Error(msg || "Subscription failed");
  }
  return { success: true };
}
