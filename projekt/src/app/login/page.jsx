


import { Suspense } from "react";
import LoginClient from "./LoginClient";


export default function Loginpage() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div> }>
            <LoginClient />
        </Suspense>
    );
}