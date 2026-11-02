"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import MessageBubble from "@/components/MessageBubble";
import Image from "next/image";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {useRouter} from "next/navigation";

type AU = {
    id: string;
    title: string;
    description: string | null;
    last_visited: string;
};

export default function Dashboard() {
    const router = useRouter();
    const supabase = createClient();
    const [username, setUsername] = useState("");
    const [aus, setAus] = useState<AU[]>([]);

    const [loading, setLoading] = useState(false);
    const [showAUModal, setAUModal] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    function openAUModal() {
        setAUModal(true);
    }

    function closeAUModal() {
        setAUModal(false);
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
    }, [supabase]);

    async function createAU(){
        if(!title.trim()){
            console.error("Please enter a title");
            return;
        }

        setLoading(true);

        const{
            data: {user},
            error: userError
        } = await supabase.auth.getUser();

        if(userError || !user){
            console.error("You must be logged in to create an AU.");
            setLoading(false);
            return;
        }

        const {data, error: insertError } = await supabase
            .from("aus")
            .insert({
                user_id: user.id,
                title: title,
                description: description.trim() || null,
            })
            .select()
            .single();

        if(insertError){
            console.error(insertError.message);
            setLoading(false);
            return;
        }

        router.push(`/AUs/${data.id}`);
    }

    async function recordLastVisited(auId: string) {
        const {error} = await supabase
            .from("aus")
            .update({
                last_visited: new Date().toISOString(),
            })
            .eq("id", auId);

        if (error) {
            console.log("recordLastVisited error:", error.message);
        }
    }

    return(
        <div className = "flex h-full flex-1 flex-col gap-20 p-10">
            <MessageBubble message = {`Hello, ${username}!`} messageFontSize="text-xl" from = "website"/>

            <div className = "flex flex-col ml-auto p-10 gap-10 bg-accent h-[70dvh] w-3/4 rounded-2xl text-background">
                <h2 className="flex flex-col text-5xl items-center">
                    Your AUs
                </h2>

                <div className = "min-h-0 flex-1 overflow-y-auto rounded-2xl bg-background p-5 scrollbar-auto scrollbar-thumb-secondary scrollbar-track-accent/80">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center gap-5 p-10 rounded-xl ">
                            <button
                                className="transition-transform duration-200 hover:translate-y-2"
                                onClick={openAUModal}>

                                <div className="relative flex aspect-4/5 items-center justify-center">
                                    <Image
                                        src="/images/phone.svg"
                                        alt="Create new AU"
                                        className="h-full w-full object-contain"
                                        width={100}
                                        height={100}
                                    />

                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="absolute size-10 text-accent"
                                        size="2xl"
                                    />
                                </div>
                            </button>

                            {aus.map((au) => (
                                <Link
                                    key={au.id}
                                    href={`/AUs/${au.id}`}
                                    className="transition-transform duration-200 hover:translate-y-2"
                                    onClick={() => recordLastVisited(au.id)}>

                                    <div className="relative flex aspect-4/5 justify-center">
                                        <Image
                                            src="/images/phone.svg"
                                            alt="AU"
                                            className="absolute h-full w-full object-contain"
                                            width={20}
                                            height={20}
                                        />

                                        <div className="absolute flex flex-col items-center">
                                            <p className="mt-10 text-accent font-bold">{au.title}</p>

                                            {au.description && (
                                                <p className = "mt-20 text-accent">
                                                    {au.description}
                                                </p>
                                            )}

                                            <p className="text-xs mt-24 text-accent">
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
                    </div>

                {showAUModal && (
                    <div className = "text-foreground">
                        <Modal title="Create AU" onCloseAction={closeAUModal}>
                            <div className="flex flex-col gap-4">
                                <Input type="text"
                                       placeholder="Title"
                                       value={title}
                                       onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-4 ">
                                <Input type="text"
                                       placeholder="Description"
                                       value={description}
                                       onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <Button text={loading ? "Creating..." : "Create AU"} onClick={createAU}/>
                        </Modal>
                    </div>
                )}
                </div>
        </div>
    );
}