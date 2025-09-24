
"use client";

import { useEffect,useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    apiGetProfile,
    apiUpdateProfile,
    apiChangePassword,
    getToken,
    } from "@/lib/apiClient";

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function Profilepage() {
    const router = useRouter();

    const [loading,setLoading]=useState(true);
    const [me, setMe]=useState(null);


    const [pMsg,setPMsg]=useState({type:"", text:""});
    const [pwMsg,setPwMsg]=useState({type:"", text:""});

    const[profile, setProfile] =useState({
        email:"",
        firstName:"",
        lastName:"",

    });


    const [passwords, setPasswords]=useState({ password:"", confirm:"" });
    const [savingProfile, setSavingProfile]=useState(false);
    const [savingpassword, setSavingPassword]=useState(false);

    const booted=useRef(false);

    useEffect(()=>{
        if(booted.current ) return;
        booted .current=true;

        const token=getToken();
        if(!token){
            router.replace("/login?next=/profile");
            return;
        }
        (async()=>{
            try{
            const data=await apiGetMe();
            setMe(data);
            setProfile({
            email: data?.email || "",
            firstName: data?.first_name ?? data?.firstName ?? "",
            lastName: data?.last_name ?? data?.lastName ?? "",
            });
        }catch{
            router.replace("/login?next=/profile");
        }finally{
            setLoading(false);
        }
        })();
    },[router]);

    async function saveProfile(e){
        e.preventDefault();
        if(savingProfile) return;
        setPMsg({type:"", text:""});

        if(!isEmail(profile.email)){
            setPMsg({type:"error", text:"please enter a valid email"});
            return;
        }
        if(!profile.firstName.trim()){
            setPMsg({type:"error", text:"first name is required"});
            return;
        }
        if(!profile.lastName.trim()){
            setPMsg({type:"error", text:"last name is required"});
            return;
        }

        if(!profile.__confirmPassword || profile.__confirmPassword .length <6){
            setPMsg({type:"error", text:"please enter your password (min 6 characters) to save changes"});
            return;
        }

        setSavingProfile(true);
        try{
            const updated=await apiUpdateProfile({
                email: profile.email,
                firstName : profile.firstName,
                lastName : profile.lastName,
                password: profile.__confirmPassword,
            });
            setMe((prev) => ({...(prev || {}), ...(updated || {}) }));
            setProfile((s) => ({...s, __confirmPassword:""}));
            setPMsg({type:"success", text:"profile updated successfully"});
        }catch(err){
            setPMsg({type:"error", text: err?.message || "failed to update profile, please try again later."});
        }finally{
            setSavingProfile(false);
        }
    }

    async function changePassword(e){
        e.preventDefault();
        if(savingpassword) return;
        setPwMsg({type:"", text:""});

        if(passwords.password .length <6){
            setPwMsg({type:"error", text:"new password should be at least 6 characters"});
            return;
        }
        if(passwords.password !== passwords.confirm){
            setPwMsg({type:"error", text:"passwords do not match"});
            return;
        }
        setSavingPassword(true);
        try{
            await apiChangePassword({ password:passwords.password });
            setPasswords({ password:"", confirm:"" });
            setPwMsg({type:"success", text:"password changed successfully"});
        }catch(err){
            setPwMsg({type:"error", text: err?.message || "failed to change password, please try again later."});
        }finally{
            setSavingPassword(false);
        }
    }
    if(loading){
        return (
            <div className="space-y-4">
                <div className="h-6 w-40 rounded bg-gray-200 animate-pulse"  />
                <div className="h-20 w-full max-w-xl rounded bg-gray-200 animate-pulse" />
                </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">Your profile</h1>
                <p className="text-gray-600">
                    Update your profile information and change your password here.
                </p>
            </header>


            <section className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-medium mb-4">Account information</h2>

                <form className="space-y-4" onSubmit={saveProfile}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First name </label>
                            <input
                            className="input"
                            value={profile.firstName}
                            onChange={(e) => setProfile((s) => ({...s, firstName: e.target.value}))}
                            placeholder="Heva"
                            autoComplete="given-name"
                            disabled={savingProfile}
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last name </label>
                        <input
                            className="input"
                            value={profile.lastName}
                            onChange={(e) => setProfile((s) => ({...s, lastName: e.target.value}))}
                            placeholder="Smith"
                            autoComplete="family-name"
                            disabled={savingProfile}
                            />
                            </div>  
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email address </label>
                        <input
                            className="input"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile((s) => ({...s, email: e.target.value}))}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={savingProfile}
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Confirm with password to save changes
                        </label>
                        <input
                            className="input"
                            type="password"
                            value={profile.__confirmPassword || ""}
                            onChange={(e) => setProfile((s) => ({...s, __confirmPassword: e.target.value}))}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={savingProfile}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                For security, please enter your current password to save changes.
                            </p>

                    </div>
                    {pMsg.text ? (
                        <p aria-live="polited"
                        className={`text-sm ${pMsg.type ==="error" ? "text-red-600" : "text-green-700"}`}>
                            {pMsg.text}
                        </p>
                    ) : null}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="btn btn-primary disabled:opacity-50"
                        >
                            {savingProfile ? "Saving..." : "Save changes"}
                        </button>
                        </div>
                </form>
            </section>


            <section className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-medium mb-4">Change password</h2>
                <form className="space-y-4" onSubmit={changePassword}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                        <div>
                            <label className="block text-sm font-medium mb-1">New password </label>
                            <input
                            className="input"
                            type="password"
                            value={passwords.password}
                            onChange={(e) => setPasswords((s) => ({...s, password: e.target.value}))}
                            placeholder="........"
                            autoComplete="new-password"
                            disabled={savingpassword}
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm new password </label>
                        <input
                            className="input"
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords((s) => ({...s, confirm: e.target.value}))}
                            placeholder="........"
                            autoComplete="new-password"
                            disabled={savingpassword}
                            />
                    </div>
                        </div>
                    {pwMsg.text ? (
                        <p aria-live="polited"
                        className={`text-sm ${pwMsg.type ==="error" ? "text-red-600" : "text-green-700"}`}>
                            {pwMsg.text}
                        </p>
                    ) : null}


                    <button
                        type="submit"
                        disabled={savingpassword}
                        className="btn btn-primary disabled:opacity-50"
                    >
                        {savingpassword ? "Saving..." : "Change password"}
                    </button>
                    </form>
 </section>
                    </div>
    );
}







           