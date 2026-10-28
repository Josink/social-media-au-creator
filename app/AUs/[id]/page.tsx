"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import {createClient} from "@/lib/supabase/client";
import {useEffect, useMemo, useState} from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";

type AU = {
    id: string;
    title: string;
    description: string | null;
    last_visited: string;
};

type Character = {
    id: string;
    au_id: string;
    name: string;
    display_name: string | null;
    username: string | null;
    description: string | null;
    avatar_url: string | null;
};

export default function AUPage({params,}: { params: Promise<{ id: string }> }) {
    const supabase = useMemo(() => createClient(), []);

    const [au, setAu] = useState<AU | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);

    const [showCharacterModal, setShowCharacterModal] = useState(false);

    const [characterName, setCharacterName] = useState("");
    const [characterDisplayName, setCharacterDisplayName] = useState("");
    const [characterUsername, setCharacterUsername] = useState("");
    const [characterDescription, setCharacterDescription] = useState("");

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    function openCharacterModal() {
        setShowCharacterModal(true);
    }

    function closeCharacterModal() {
        setShowCharacterModal(false);
    }

    async function addCharacter(){
        if (!au || !characterName.trim()){
            return;
        }
        const {data: characterData, error: characterInsertError} = await supabase
            .from("characters")
            .insert({
                au_id: au.id,
                name: characterName.trim(),
                display_name: characterDisplayName.trim() || null,
                username: characterUsername.trim() || null,
                description: characterDescription.trim() || null,
            })
            .select()
            .single()

        if (characterInsertError){
            console.log("Character insert error: ", characterInsertError.message);
            return;
        }

        setCharacters((previous) => [...previous, characterData]);

        setCharacterName("");
        setCharacterDisplayName("");
        setCharacterUsername("");
        setCharacterDescription("");

        closeCharacterModal();
    }

    useEffect(() => {
        let cancelled = false;

        async function loadAU(){
            const { id } = await params;

            const [auResult, charactersResult] = await Promise.all([
                supabase
                    .from("aus")
                    .select("*")
                    .eq("id", id)
                    .single(),

                supabase
                    .from("characters")
                    .select("*")
                    .eq("au_id", id),
            ]);

            if (cancelled) return;

            if (auResult.error){
                console.log("AU result error: ", auResult.error.message);
                return;
            }

            if (charactersResult.error){
                console.log("Characters result error: ", charactersResult.error.message);
                return;
            }

            setAu(auResult.data);
            setCharacters(charactersResult.data);
        }

        loadAU();

        return () => {
            cancelled = true;
        }
    },[params, supabase])

    return (
        <div className = "min-h-0 w-full flex flex-1 flex-col gap-20 p-10">
            <div className = "flex flex-col items-center">
                <h1 className = "text-5xl">{au?.title}</h1>
            </div>

            <div className = "flex flex-row gap-5 p-10 overflow-x-auto scroll-smooth snap-x snap-mandatory">
                <button
                    onClick = {openCharacterModal}
                    className = "flex flex-col shrink-0 snap-center items-center justify-center gap-3 w-56 h-64 rounded-2xl"
                >
                    <FontAwesomeIcon
                        icon={faUserPlus}
                        className="size-10 text-accent"
                        size="2xl"/>

                    <span className="font-semibold">
                        Add Character
                    </span>
                </button>

                {characters.map((character) => (
                    <div
                        key={character.id}
                        className = "flex flex-col shrink-0 items-center snap-center w-56 h-64 gap-3 rounded-2xl border border-accent p-4"
                    >
                        {character.avatar_url ? (
                            <img
                                src = {character.avatar_url}
                                alt = {character.display_name ?? character.name}
                                className = "size-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className = "flex size-24 items-center justify-center rounded-full bg-accent">
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    className = "size-8 text-accent"
                                    />
                            </div>
                        )}

                        <h2 className = "text-xl font-bold">
                            {character.display_name ?? character.name}
                        </h2>

                        {character.username && (
                            <p className = "text-gray-500">
                                {character.username.startsWith("@")
                                    ? character.username
                                    : `@${character.username}`}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {showCharacterModal && (
                <div>
                    <div className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" />
                    <div className = "flex flex-col justify-center items-center gap-10 p-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex flex-col gap-4">
                            <Input
                                type="text"
                                placeholder="Character Name"
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                            />

                            <Input
                                type="text"
                                placeholder="Character Display Name"
                                value={characterDisplayName}
                                onChange={(e) => setCharacterDisplayName(e.target.value)}
                            />

                            <Input
                                type="text"
                                placeholder="Character Username"
                                value={characterUsername}
                                onChange={(e) => setCharacterUsername(e.target.value)}
                            />

                            <Input
                                type="text"
                                placeholder="Character Description"
                                value={characterDescription}
                                onChange={(e) => setCharacterDescription(e.target.value)}
                            />

                            <div className="flex flex-col gap-4">
                                {avatarPreview && (
                                    <img
                                        src={avatarPreview}
                                        alt="Character Profile Preview"
                                        className="size-12 rounded-full object-cover"
                                    />
                                )}

                                <label className="cursor-pointer rounded-lg bg-accent text-white">
                                    Choose Character Avatar
                                    <input
                                        type="file"
                                        placeholder="Character Avatar"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;

                                            if (!file) return;

                                            if (file.size > 5 * 1024 * 1024) {
                                                alert("Avatar must be less than 5MB");
                                                e.target.value = "";
                                                return;
                                            }

                                            setAvatarFile(file);
                                            setAvatarPreview(URL.createObjectURL(file));
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <Button text="Add Character" onClick={addCharacter}/>
                    </div>
                </div>
            )}
        </div>
    );
}