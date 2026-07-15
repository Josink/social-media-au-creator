"use client";

import Link from "next/link";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import Input from "@/components/Input";

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
                text="Log In!"
                onClick={handleLogin}
            />

        </div>

        <section className= "flex flex-col gap-5 items-center">
            <h4>Don&#39;t have an account?</h4>
            <Link href = "/SignupPage">Sign Up!</Link>
            <Link href = "/Dashboard">Dashboard</Link>
        </section>
        
    </div>
    );
}