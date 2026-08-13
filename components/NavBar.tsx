"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {useRouter} from "next/navigation";

export default function NavBar() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    async function loadUser(){
        const { data: { user }} = await supabase.auth.getUser();
        setUser(user);
    }

    useEffect(() => {
        loadUser();

        const {data: {subscription}, } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        })

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth])

    const [profileOpen, setProfileOpen] = useState(false);

    function previewProfile(){
        setProfileOpen(!profileOpen);
    }

    async function handleLogout(){
        await supabase.auth.signOut();

        setUser(null);
        setProfileOpen(false);

        router.push("/");
    }

    return(
        <nav className = "sticky top-0 z-50 flex h-16 items-center justify-between py-10 px-5 text-lg">
            <div className = "gap-5 flex flex-row">
                <Link className = "hover:text-accent"  href = "/Dashboard">
                    Social Media AU Creator
                </Link>

                <Link className = "hover:text-accent" href = "https://github.com/Josink">
                    GitHub
                </Link>
            </div>

            <div className = "gap-5 flex flex-row items-center">
                {!user && (
                    <>
                        <Link className = "hover:text-accent" href = "/LoginPage">Log In</Link>

                        <Link className = "hover:text-accent" href = "/SignupPage">Sign Up</Link>
                    </>
                )}

                {user && (
                    <button className = "hover:text-accent" onClick={previewProfile}>P</button>

                )}

                {user && profileOpen && (
                    <div className = "absolute right-0 top-16 w-48 bg-foreground rounded-lg shadow-lg p-2 mx-5">
                        <div className = "flex flex-col gap-2 items-start text-background">
                            <Link className = "hover:text-accent" href = "/Profile">Profile</Link>
                            <Link className = "hover:text-accent" href = "/AccountSettings">Account Settings</Link>
                            <button className = "hover:text-accent" onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                )}
            </div>

        </nav>
    );
}