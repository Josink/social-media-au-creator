"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    function handleSignupClick() {
        router.push(`/SignupPage?email=${encodeURIComponent(email)}`);
    }

  return (
      <div className = "flex h-full flex-col justify-center gap-20 p-10">
          <section className= "flex flex-col gap-5 justify-center items-start">
              <h4 className = "text-7xl">Welcome to the</h4>
              <h1 className = "text-8xl">Social Media AU Creator</h1>
          </section>

          <section className= "flex flex-col gap-5 items-center text-xl">
              <h6>This is a website that handles all the time-consuming formatting
              for your social media AUs. You just worry about the story you&#39;re trying to
              tell, and we&#39;ll handle the rest!</h6>
          </section>

          <div className="flex flex-row gap-5 bg-white p-2 rounded-xl items-center self-center">
              <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button text="Sign Up!" onClick={handleSignupClick}/>
          </div>

      </div>
  );
}
