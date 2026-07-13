"use client";

import Link from "next/link";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";

export default function SignupPage(){
    const supabase = createClient();

    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    async function handleSignup(){
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (error) {
            console.log(error.message);
            return;
        }

        console.log("Account created!");
    }

    return(
    <div className = "flex h-full flex-1 flex-col gap-20 items-center justify-center p-10">
        <section>
            <h4>First Time?</h4>
            <h6>Create Your Account!</h6>
        </section>

        <div className = "flex flex-col gap-10 items-center border border-black/10 dark:border-white/10 shadow-lg rounded-2xl p-10">
            <input
                type = "text"
                value={username}
                onChange={(u) => setUsername(u.target.value)}
                placeholder= "Username"
                className= "border rounded-md p-2"
            />

            <input
                type = "email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder= "Email"
                className= "border rounded-md p-2"
            />

            <input
                type = "password"
                value={password}
                onChange={(p) => setPassword(p.target.value)}
                placeholder= "Password"
                className= "border rounded-md p-2"
            />

            <button
                type = "button"
                className = "rounded bg-blue-300 p-3 hover:bg-blue-400"
                onClick={handleSignup}
            >
                Sign Up!
            </button>
        </div>

        <section className= "flex flex-col gap-5 items-center">
            <h4>Already have an account?</h4>
            <Link href = "/LoginPage">Log In!</Link>
        </section>

    </div>
    );
}