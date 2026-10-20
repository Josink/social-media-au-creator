"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import MessageBubble from "@/components/MessageBubble";

type AU = {
    id: string;
    title: string;
    description: string | null;
    last_visited: string;
};

export default function Dashboard() {

    const supabase = createClient();
    const [username, setUsername] = useState("");
    const [aus, setAus] = useState<AU[]>([]);

    const [loading, setLoading] = useState(false);

    async function recordLastVisited(auId: string) {
        const {data, error} = await supabase
            .from("aus")
            .update({
                last_visited: new Date().toISOString(),
            })
            .eq("id", auId);

        if (error) {
            console.log("recordLastVisited error:", error.message);
        }
    }

    useEffect(() => {
        async function loadDashboard() {
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

            setUsername(data.username);

            const { data: ausData, error: ausError } = await supabase
                .from("aus")
                .select("*")
                .eq("user_id", user.id)
                .order("last_visited", { ascending: false });

            if (ausError) {
                console.log("AUs error: ", ausError.message);
                setLoading(false);
                return;
            }
            setAus(ausData);
            setLoading(false);
        }

        loadDashboard();
    }, []);

    return(
        <div className = "flex h-full flex-1 flex-col gap-20 p-10">
            <MessageBubble message = {`Hello, ${username}!`} messageFontSize="text-xl" from = "website"/>

            <MessageBubble from = "user" scrollable={ true} maxHeight="50dvh">
                <h2 className="flex text-5xl p-10 self-center">
                    Your AUs
                </h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 p-10">
                    <Link href="/AUs/New" className = "transition-transform duration-200 hover:translate-y-2">
                        <div className="relative flex aspect-4/5 items-center justify-center">
                            <img
                                src="/images/phone.svg"
                                alt="Create new AU"
                                className="h-full w-full object-contain"
                            />

                            <FontAwesomeIcon
                                icon={faPlus}
                                className="absolute size-10 text-accent"
                                size = "2xl"
                            />
                        </div>
                    </Link>

                    {aus.map((au) => (
                        <Link
                            key={au.id}
                            href={`/AUs/${au.id}`}
                        className = "transition-transform duration-200 hover:translate-y-2"
                        onClick={() => recordLastVisited(au.id)}>

                            <div className="relative flex aspect-4/5 justify-center">
                                <img
                                    src="/images/phone.svg"
                                    alt="Create new AU"
                                    className="h-full w-full object-contain"
                                />

                                <div className = "absolute flex flex-col items-center">
                                    <p className = "mt-10 text-accent font-bold">{au.title}</p>

                                    {au.description && (
                                        <p>{au.description}</p>
                                    )}

                                    <p className = "text-xs">
                                        {new Date(au.last_visited).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>

            </MessageBubble>
        </div>
    );
}