"use client";

import Link from "next/link";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const supabase = createClient();

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(){
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log(error.message);
            return;
        }

        router.push("/Dashboard");
    }

    return(
    <div className = "flex h-full flex-1 flex-col gap-20 items-center justify-center p-10">
        <section>
            <h6>Log In!</h6>
        </section>

        <div className = "flex flex-col gap-10 items-center border border-black/10 dark:border-white/10 shadow-lg rounded-2xl p-10">
            <input
                type = "email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder= "email"
                className= "border rounded-md p-2"
            />

            <input
                type = "password"
                value={password}
                onChange={(p)=>setPassword(p.target.value)}
                placeholder= "Password"
                className= "border rounded-md p-2"
            />

            <button
                type = "button"
                className = "rounded bg-blue-300 p-3 hover:bg-blue-400"
                onClick={handleLogin}
            >
                Log In!
            </button>

        </div>

        <section className= "flex flex-col gap-5 items-center">
            <h4>Don&#39;t have an account?</h4>
            <Link href = "/SignupPage">Sign Up!</Link>
            <Link href = "/Dashboard">Dashboard</Link>
        </section>
        
    </div>
    );
}