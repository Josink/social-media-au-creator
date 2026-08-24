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
            className = "flex flex-col rounded bg-accent p-3 hover:bg-accent/80 justify-center items-center">
            {text}
        </button>
    )

}