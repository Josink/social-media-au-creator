import Link from "next/link";

export default function NavBar() {
    return(
        <nav className = "sticky top-0 z-50 flex h-16 items-center justify-between py-10 px-5 text-lg">
            <div className = "gap-5 flex flex-row">
                <Link className = "hover:text-accent"  href = "/Dashboard">
                    Social Media AU Creator
                </Link>

                <Link className = "hover:text-accent" href = "https://github.com/Josink">
                    GitHub
                </Link>
            </div>

            <div className = "gap-5 flex flex-row items-center">
                <Link className = "hover:text-accent" href = "/LoginPage">Log In</Link>

                <Link className = "hover:text-accent" href = "/SignupPage">Sign Up</Link>

                <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
                    <circle r="20" cx="50" cy="50" className="fill-secondary"/>
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
                          className="fill-white font-bold text-lg">P
                    </text>
                </svg>
            </div>

        </nav>
    );
}