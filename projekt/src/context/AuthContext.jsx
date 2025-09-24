
"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  apiLogin,
  apiLogout,
  apiGetMe,
  getToken,
  getUserId,
  setUserId,
  clearToken,
  clearUserId,
} from "@/lib/apiClient";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const booted = useRef(false);

  
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    async function boot() {
      try {
        const token = getToken();
        const uid = getUserId();

     
    
        if (!token || !uid) {
          setUser(null);
          return;
        }

        const me = await apiGetMe();
        if (me?.id || me?._id) {
      
          setUserId(me.id ?? me._id);
        }
        setUser(me);
      } catch (err) {
      
        clearToken();
        clearUserId();
        setUser(null);
      } finally {
        setReady(true);
      }
    }

    boot();

    function onStorage(e) {
      if (e.key === "swaphub_token" || e.key === "swaphub_user_id") {
      
        booted.current = false;
        setReady(false);
        boot();
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

 
  async function signIn(email, password) {
   await apiLogin(email, password); 
    const me = await apiGetMe();
    if (me?.id || me?._id) setUserId(me.id ?? me._id);
    setUser(me);
    return me;
  }


  async function signOut() {
    try {
      await apiLogout(); 
    } finally {
      setUser(null);
    
      window.location.replace("/");
    }
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      ready,
      signIn,
      signOut,
     
      refresh: async () => {
        const me = await apiGetMe();
        if (me?.id || me?._id) setUserId(me.id ?? me._id);
        setUser(me);
        return me;
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
