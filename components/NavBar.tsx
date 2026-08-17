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
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");

    async function loadProfile(){
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError){
            console.log(userError.message);
            return;
        }

        if (!user){
            setUser(null);
            setUsername("");
            setDisplayName("");
            return;
        }

        setUser(user);

        const { data, error } = await supabase
            .from("profiles")
            .select("username, display_name")
            .eq("id", user.id)
            .single();

        if (error) {
            console.log("AccountPage error: ", error.message);
            return;
        }

        setUsername(data.username);
        setDisplayName(data.display_name)
    }

    useEffect(() => {
        loadProfile();

        const {data: {subscription}, } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);

            if (session?.user){
                loadProfile();
            } else {
                setUser(null);
                setUsername("");
                setDisplayName("");
            }
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

                            <div className = "flex flex-row gap-2 items-center">

                                <button>P</button>

                                <div className = "flex flex-col items-center">
                                    <p>{displayName || "Display Name"}</p>
                                    <p>{username || "Username"}</p>
                                </div>

                            </div>

                            <Link className = "hover:text-accent" href = "/AccountPage">Account</Link>

                            <button className = "hover:text-accent" onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                )}
            </div>

        </nav>
    );
}