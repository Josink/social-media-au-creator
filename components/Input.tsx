import React from "react";

type InputProps = {
    type: "text" | "email" | "password" | "file";
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    accept?: string;
}

export default function Input({ type, placeholder, value, onChange, id, accept }: InputProps) {
    if (type === "file") {
        const inputId = id ?? "file-input";

        return (
            <label
                htmlFor={inputId}
                className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-center"
            >
                {placeholder ?? "Choose file"}
                <input
                    type="file"
                    id={inputId}
                    accept={accept}
                    onChange={onChange}
                    className="hidden"
                />
            </label>
        );
    }

    return (
        <input
            type = {type}
            placeholder = {placeholder}
            value = {value}
            onChange = {onChange}
            id = {id}
            accept = {accept}
            className = "p-2 rounded-lg outline-foreground"
        />
    );
}