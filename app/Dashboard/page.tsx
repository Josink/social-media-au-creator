"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";

export default function Dashboard() {

    const supabase = createClient();
    const [username, setUsername] = useState("");

    useEffect(() => {
        async function loadProfile() {

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (error) {
                console.log(error.message);
                return;
            }

            setUsername(data.username);
        }

        loadProfile();
    }, []);

    return(
        <div className = "flex h-full flex-1 flex-col gap-20 p-10">
            <div>
                <h2>Welcome, {username}</h2>

                <h2>Your AUs</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 p-10">
                    <Link href="/AUs/New">
                        <div className="flex aspect-4/5 items-center justify-center rounded-xl border-2 border-dashed">
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="size-8 text-gray-400"
                            />
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}