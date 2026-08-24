"use client";

import {createClient} from "@/lib/supabase/client";
import {useEffect, useState} from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ProfilePage() {
    const supabase = createClient();
    const [account, setAccount] = useState({
        email: "",
        username: "",
        displayName: "",
        avatar: "",
        bio: "",
        dateJoined: "",
    })

    const[email, setEmail] = useState("");
    const[username, setUsername] = useState("");
    const[displayName, setDisplayName] = useState("");
    const[avatar, setAvatar] = useState("");
    const[bio, setBio] = useState("");

    useEffect(() => {
        async function loadProfile(){
            const {
                data : { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError){
                console.log(userError.message);
                return;
            }

            if (!user){
                return;
            }

            const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) {
                console.log("ProfilePage error: ", error.message);
            }

            setAccount({
                email: user.email ?? "",
                username: profile.username ?? "",
                displayName: profile.display_name ?? "",
                avatar: profile.avatar_url ?? "",
                bio: profile.bio ?? "",
                dateJoined: profile.created_at ?? ""
            })

            setEmail(user.email ?? "");
            setUsername(profile.username ?? "");
            setDisplayName(profile.displayName ?? "");
            setAvatar(profile.avatar_url);
            setBio(profile.bio);
        }

        loadProfile();
    }, []);

    async function handleUpdateProfile(){
        const {
            data : { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError){
            console.log(userError.message);
            return;
        }

        if (!user){
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({ username: username,
                display_name: displayName })
            .eq('id', user.id)

        if (error) {
            console.log("Update profile error: ", error.message);
            return;
        }

        const {error: updateEmailError} = await supabase.auth.updateUser({email: email});

        if (updateEmailError){
            console.log("Update email error: ", updateEmailError.message);
            return;
        }
    }

    return(
        <div className = "h-full flex flex-col gap-20 p-10">

            <h1 className = "text-2xl font-bold">Your Account</h1>

            <div className = "items-center">

                <section>
                    <div className="bg-accent flex flex-col gap-10 p-10 rounded">
                        <div className="flex flex-row gap-5 items-center">
                            <p>Display Name</p>
                            <Input type="text"
                                   placeholder="Display Name"
                                   value={displayName}
                                   onChange={(d) => setDisplayName(d.target.value)}/>
                        </div>

                        <div className="flex flex-row gap-5 items-center">
                            <p>Username</p>
                            <Input type="text"
                                   placeholder="Username"
                                   value={username}
                                   onChange={(u) => setUsername(u.target.value)}/>
                        </div>

                        <div className="flex flex-row gap-5 items-center">
                            <p>Email</p>
                            <Input type = "text"
                                   placeholder = "Email"
                                   value = {email}
                                   onChange = {(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className="flex flex-row gap-5 items-center">
                            <p>Date Joined</p>
                            <p>{account.dateJoined || "Date Joined"}</p>
                        </div>
                    </div>
                </section>

            </div>

            <div className = "fixed bottom-5 right-5"><Button text="Save Changes" onClick={handleUpdateProfile}/></div>

        </div>
    );
}