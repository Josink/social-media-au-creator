import React from "react";

type InputProps = {
    type: "text" | "email" | "password";
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ type, placeholder, value, onChange }: InputProps) {
    return (
        <input
            type = {type}
            placeholder = {placeholder}
            value = {value}
            onChange = {onChange}
            className = "p-2 rounded-lg outline-foreground bg-background"
        />
    );
}