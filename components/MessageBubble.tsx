import TextingAnimation from "@/components/TextingAnimation";
import {useEffect, useState} from "react";

type MessageBubbleProps = {
    children?: React.ReactNode;
    message?: string;
    messageFontSize?: "text-xs" |"text-sm" | "text-base" | "text-lg" | "text-xl" |"text-2xl" | "text-3xl" | "text-4xl"
        | "text-5xl"| "text-6xl"| "text-7xl"| "text-8xl"| "text-9xl";
    from?: "website" | "user";
    textingDuration?: number;
    maxHeight?: string;
}

export default function MessageBubble({
                                          children,
                                          message,
                                          messageFontSize = "text-base",
                                          from = "website",
                                          textingDuration = 0}:
    MessageBubbleProps){

    const [texting, setTexting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTexting(false);
        }, textingDuration);

        return () => clearTimeout(timer);
    }, [textingDuration])

    return (
        <div className = {`flex w-full ${from === "user" ? "justify-end" : "justify-start"}`}>
            <div className = {`flex flex-col px-4 py-2 rounded-2xl max-w-3/4 hover: ${
                from === "website"
                    ? "bg-message rounded-bl-sm shadow shadow-shadow"
                    : "bg-accent rounded-br-sm text-background shadow shadow-shadow"
            }
            `}>
                {children ? (
                    children
                ) : texting ? (
                    <TextingAnimation from={from}/>
                ) : (
                <p className={`${messageFontSize} leading-snug wrap-break-word`}>
                    {message}
                </p>
            )}
            </div>
        </div>
    );
}