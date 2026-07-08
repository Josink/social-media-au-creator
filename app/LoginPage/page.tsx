import Link from "next/link";

export default function LoginPage(){
    return(
    <div className = "flex min-h-screen flex-col gap-20 items-center justify-center">
        <section>
            <h6>Log In!</h6>
        </section>

        <div className = "flex flex-col gap-10 items-center border border-black/10 dark:border-white/10 shadow-lg rounded-2xl p-10">
            <input
                type = "text"
                placeholder= "Username"
                className= "border rounded-md p-2"
            />

            <input
                type = "password"
                placeholder= "Password"
                className= "border rounded-md p-2"
            />

            <button
                type = "submit"
                className = "rounded bg-blue-300 p-3"
            >
                Log In!
            </button>

        </div>

        <section className= "flex flex-col gap-5 items-center">
            <h4>Don&#39;t have an account?</h4>
            <Link href = "/SignupPage">Sign Up!</Link>
        </section>
        
    </div>
    );
}