type buttonProps = {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

export default function Button({
                                   text,
                                   onClick,
                                   type = "button",
                               }: buttonProps) {
    return (
        <button
            type = {type}
            onClick = {onClick}
            className = "rounded bg-accent p-3 hover:accent-accent/80"
        >
            {text}
        </button>
    )

}