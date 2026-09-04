"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {useState} from "react";

export default function New() {
    const router = useRouter();
    const supabase = createClient();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function createAU(){
        setError("");

        if(!title.trim()){
            setError("Please enter a title");
            return;
        }

        setLoading(true);

        const{
            data: {user},
            error: userError
        } = await supabase.auth.getUser();

        if(userError || !user){
            setError("You must be logged in to create an AU.");
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
            setError(insertError.message);
            setLoading(false);
            return;
        }

        router.push(`/AUs/${data.id}`);
    }

    return(
        <div className = "flex h-full flex-1 flex-col items-center justify-center p-10 gap-20">

            <div className = "w-lg bg-primary p-10 rounded-2xl flex flex-col gap-10">
                <section>
                    <h1>Create A New AU</h1>
                </section>

                <div>
                    <h1>Title</h1>
                    <Input type="text" placeholder="Title"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <h1>Description</h1>
                    <Input type="text" placeholder="Description"
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <Button text={loading ? "Creating..." : "Create AU"}
                onClick={createAU}/>
            </div>

        </div>
    );
}