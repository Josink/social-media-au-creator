type TextingAnimationProps = {
    from?: "website" | "user";
};

export default function TextingAnimation({from}: TextingAnimationProps) {
    return (
        <div className = {from === "website" ? "flex justify-start" : "flex justify-end"}>
            <div className= "flex gap-2">
                <span className = "inline-block w-2 h-2 bg-accent rounded-full opacity-40 animate-bounce"></span>
                <span className = "inline-block w-2 h-2 bg-accent rounded-full opacity-40 animate-bounce [animation-delay: 400ms]"></span>
                <span className = "inline-block w-2 h-2 bg-accent rounded-full opacity-40 animate-bounce [animation-delay: 800ms]"></span>
            </div>
        </div>
    );
}