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
            className = "bg-accent text-white px-5 py-2 rounded-lg hover:bg-accentbg transition">
            {text}
        </button>
    )

}