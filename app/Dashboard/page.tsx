"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";

type AU = {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
};

export default function Dashboard() {

    const supabase = createClient();
    const [username, setUsername] = useState("");
    const [aus, setAus] = useState<AU[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError){
                console.log(userError.message);
                setLoading(false);
                return;
            }

            if (!user){
                console.log("User not logged in");
                setLoading(false);
                return;
            }

            console.log("Logged-in user id: ", user.id);

            const { data, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (error) {
                console.log("AccountPage error: ", error.message);
                setLoading(false);
                return;
            }

            console.log("AccountPage data: ", data);
            setUsername(data.username);

            const { data: ausData, error: ausError } = await supabase
                .from("aus")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (ausError) {
                console.log("AUs error: ", ausError.message);
                setLoading(false);
                return;
            }
            setAus(ausData);

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

                    {aus.map((au) => (
                        <Link
                            key={au.id}
                            href={`/AUs/${au.id}`}
                        >
                            <div className="bg-primary p-5 rounded-2xl">

                                <h2>{au.title}</h2>

                                {au.description && (
                                    <p>{au.description}</p>
                                )}

                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}