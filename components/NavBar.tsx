import Link from "next/link";

export default function NavBar() {
    return(
        <nav className = "sticky top-0 z-50 flex h-16 items-center justify-between px-6">
            <div className = "gap-5 flex flex-row">
                <p>
                    Social Media AU Creator
                </p>

                <Link href = "https://github.com/Josink">GitHub</Link>
            </div>

            <p>
                pfp
            </p>

        </nav>
    );
}