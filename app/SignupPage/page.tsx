"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import {useSearchParams} from "next/navigation";

export default function SignupPage(){
    const supabase = createClient();

    const searchParams = useSearchParams();
    const emailFromHomePage = searchParams.get("email") ?? "";

    const[username, setUsername] = useState("");
    const[email, setEmail] = useState(emailFromHomePage);
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
            <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(u) => setEmail(u.target.value)}
            />

            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                type = "password"
                placeholder = "Password"
                value = {password}
                onChange = {(p) => setPassword(p.target.value)}
            />

            <Button
            text="Sign Up!"
            onClick={handleSignup}
            />
        </div>

        <section className= "flex flex-col gap-5 items-center">
            <h4>Already have an account?</h4>
            <Link href = "/LoginPage">Log In!</Link>
        </section>

    </div>
    );
}