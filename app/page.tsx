"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import MessageBubble from "@/components/MessageBubble";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export default function Home() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const router = useRouter();

    function handleSignupClick() {
        router.push(`/SignupPage?email=${encodeURIComponent(email)}`);
    }

    async function loadUser(){
        const { data: { user }} = await supabase.auth.getUser();
        if (user) router.push("/Dashboard");
    }

    useEffect(() => {
        loadUser();
    }, []);

  return (
      <div className = "flex h-full flex-col justify-center gap-20 p-10">
          <section className= "flex flex-col gap-5">
              <MessageBubble message="Welcome to" messageFontSize="text-5xl" from = "website" textingDuration = {2000}/>
              <MessageBubble message="SMAUR" messageFontSize="text-6xl" from = "website" textingDuration = {3000}/>
          </section>

          <section className= "flex flex-col gap-5">
              <MessageBubble message= "This is a website that handles all the time-consuming formatting for your social media AUs. You just worry about the story you're trying to tell, and we'll handle the rest!"
                             messageFontSize="text-xl" from = "website" textingDuration = {4000}/>

              <MessageBubble message = "Sign Up?" messageFontSize ="text-lg" from = "website" textingDuration = {5000}></MessageBubble>
          </section>

          <div className="flex flex-row gap-5 bg-white p-2 rounded-xl items-center self-center">
              <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button text="Sign Up!" onClick={handleSignupClick}/>
          </div>

      </div>
  );
}
