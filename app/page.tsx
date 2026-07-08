import Image from "next/image";

export default function Home() {
  return (
      <div className = "flex min-h-screen flex-col items-center justify-center gap-20">
          <section>
              <h4>Welcome to the</h4>
              <h1>Social Media AU Creator</h1>
          </section>

          <section>
              <h6>This is a website that handles all the time-consuming formatting
              for your social media AUs. You just worry about the story you&#39;re trying to
              tell, and we&#39;ll handle the rest!</h6>
          </section>

          <div className= "flex flex-col gap-10 items-center">
              <h2>Get Started</h2>
              <div className = "flex flex-row gap-5">
                  <a href="/SignupPage">Sign Up!</a>
                  <a href="/LoginPage">Log In!</a>
                </div>
          </div>
      </div>
  );
}
