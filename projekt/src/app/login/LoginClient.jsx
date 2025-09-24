"use client";

import { useEffect,useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth} from "@/contexts/AuthContext";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function LoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextParam = searchParams.get("next") ;
    const { sigmIn} = useAuth();

    // login form
    const [form,setForm]=useState({email:"", password:""});
    const [loading,setLoading]=useState(false);
    const [msg,setMsg]=useState({type:"", text:""});

    const safeNext=useMemo(()=>{
        if(typeof nextParam ==="string" && nextParam.startsWith("/") )
        return nextParam;
        return "/profile";
    },[nextParam]);

    async function onSubmit(e){
        e.preventDefault();
        if(loading) return;
        setMsg({type:"", text:""});



        if(!isEmail(form.email)) {
            setMsg({type:"error", text:"please enter a valid email"});
            return;

        }
        if(!form.password.trim()){
            setMsg({type:"error", text:"password is required"});
            return;
        }

        setLoading(true);
        try{

            // 
            await signIn(form.email, form.password);
            setMsg({type:"success", text:"Welcome back!"});
            router.repalce(safeNext);
        }catch(err){
            setMsg({type:"error", text: err?.message || "login failed, please try again later."});
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!msg.text) return;
        const id=setTimeout(()=> setMsg({type:"", text:""}), 5000);
        return ()=> clearTimeout(t);
        },[msg.text]);

    return (
        <div className="max-auto w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-6">Login to your account</h1>
            <form className="space-y-4 rounded-2xl border bg-white p-6" onSubmit={onSubmit}>
                <div>
                    <label className="block text-sm font-medium mb-1" >Email</label>
                    <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(e)=> setForm((s)=> ({...s, email: e.target.value}))}
                    placeholder="you@rxample.com"
                    autoComplete="email"
                    />
                </div>

                {msg.text && (
                    <p role="status"
                    className={`text-sm ${msg.type==="error" ? "text-red-600" : "text-green-600"}`} >
                        {msg.text}
                    </p>
                )}


                <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50" >
                    {loading ? "Logging in..." : "login"}

                </button>
            </form>

            <p className="mt-3 text-sm">
                <a
                href="#"
                onClick={(e)=> e.preventDefault()}
            aria-disabled="true"
                className="font-semibold text-black cursor-default" >
                    Forgot password? 
                </a>
            </p>

        </div>
    );
}
