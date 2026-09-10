type MessageBubbleProps = {
    message: string;
    messageFontSize?: "text-xs" |"text-sm" | "text-base" | "text-lg" | "text-xl" |"text-2xl" | "text-3xl" | "text-4xl"
        | "text-5xl"| "text-6xl"| "text-7xl"| "text-8xl"| "text-9xl";
}

export default function MessageBubble({message, messageFontSize}: MessageBubbleProps) {
    return (
        <div className = "bg-primary flex flex-col p-2 rounded-lg">
            <p className={messageFontSize}> {message}</p>
        </div>
    );
}