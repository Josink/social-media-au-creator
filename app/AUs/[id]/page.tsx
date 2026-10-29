"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUser } from "@fortawesome/free-solid-svg-icons";

import {createClient} from "@/lib/supabase/client";
import {useEffect, useMemo, useState} from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";

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
    avatarSignedUrl: string | null;
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

        //authenticate user
        const {data: {user}, error: userError} = await supabase.auth.getUser();

         if (userError || !user){
             console.log("User error: ", userError?.message);
             return;
         }

         //upload avatar
        let avatarPath: string | null = null;

         if (avatarFile){
             const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

             if (!allowedTypes.includes(avatarFile.type) || avatarFile.size > 5 * 1024 * 1024){
                 console.error("Choose a supporter image less than 5MB");
                 return;
             }

             const extensionByType: Record<string, string> = {
                 "image/png": ".png",
                 "image/jpeg": ".jpg",
                 "image/webp": ".webp",
             }

             const filePath = `${user.id}/${au.id}/${crypto.randomUUID()}${extensionByType[avatarFile.type]}`;

             const {data: uploadCharacterAvatarData, error: uploadCharacterAvatarError} =
                 await supabase.storage.from("character-avatars").upload(filePath, avatarFile,{
                 contentType: avatarFile.type,
                 upsert: false,
             });

             if (uploadCharacterAvatarError){
                 console.error("Upload character avatar error: ", uploadCharacterAvatarError.message);
                 return;
             }

             avatarPath = uploadCharacterAvatarData.path;
         }

         //insert character into database
        const {data: characterData, error: characterInsertError} = await supabase
            .from("characters")
            .insert({
                au_id: au.id,
                name: characterName.trim(),
                display_name: characterDisplayName.trim() || null,
                username: characterUsername.trim() || null,
                description: characterDescription.trim() || null,
                avatar_url: avatarPath,
            })
            .select()
            .single()

        if (characterInsertError){
            console.error("Character insert error: ", characterInsertError.message);

            if (avatarPath){
                const {error: deleteAvatarError} = await supabase.storage
                    .from("character-avatars")
                    .remove([avatarPath]);

                if (deleteAvatarError){
                    console.error("Delete character avatar error: ", deleteAvatarError.message);
                }
            }
            return;
        }

        let avatarSignedUrl: string | null = null;

        if (characterData.avatar_url){
            const {data, error} = await supabase.storage
                .from("character-avatars")
                .createSignedUrl(characterData.avatar_url, 60 * 60)

            if (error){
                console.error("Failed to load avatar for character:", error.message);
                return;
            }

            avatarSignedUrl = data.signedUrl;
        }

        setCharacters((previous) => [...previous, { ...characterData, avatarSignedUrl}]);

        setCharacterName("");
        setCharacterDisplayName("");
        setCharacterUsername("");
        setCharacterDescription("");
        setAvatarFile(null);
        setAvatarPreview("");

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

            const charactersWithUrls = await Promise.all(
                charactersResult.data.map(async (character) => {
                    if (!character.avatar_url) {
                        return { ...character, avatarSignedUrl: null };
                    }

                    const { data, error } = await supabase.storage
                        .from("character-avatars")
                        .createSignedUrl(character.avatar_url, 60 * 60);

                    if (error) {
                        console.error(
                            `Failed to load avatar for ${character.name}:`,
                            error.message
                        );

                        return { ...character, avatarSignedUrl: null };
                    }

                    return {
                        ...character,
                        avatarSignedUrl: data.signedUrl,
                    };
                })
            );

            if (cancelled) return;

            setCharacters(charactersWithUrls);
        }

        loadAU();

        return () => {
            cancelled = true;
        }
    },[params, supabase])

    return (
        <div className = "min-h-0 w-full flex flex-1 flex-col gap-20 p-10 overflow-hidden">
            <div className = "flex flex-col items-center">
                <h1 className = "text-5xl">{au?.title}</h1>
            </div>

            <div className = "flex flex-row self-center gap-5 p-10 w-4/5 min-w-0 max-w-full overflow-x-auto overscroll-contain-x scroll-smooth snap-x snap-mandatory">
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
                        className = "box-border flex min-h-64 w-56 shrink-0 snap-center flex-col items-center gap-3 rounded-2xl border border-accent p-4"
                    >
                        {character.avatarSignedUrl? (
                            <Image
                                src = {character.avatarSignedUrl!}
                                alt = {character.display_name || character.name}
                                className = "size-24! min-h-24! min-w-24! shrink-0 aspect-square rounded-full object-cover"
                                width = {100}
                                height = {100}/>
                        ) : (
                            <div className = "flex size-24 items-center justify-center rounded-full">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className = "size-16 text-accent"
                                    />
                            </div>
                        )}

                        <h2 className = "max-w-full wrap-break-word text-center text-xl font-bold">
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
                                    <Image
                                        src = {avatarPreview}
                                        alt = "Character Profile Preview"
                                        className = "size-12 rounded-full object-cover"
                                        width = {100}
                                        height = {100}
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