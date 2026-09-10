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
          <section className= "flex flex-col gap-5 justify-center items-start">
              <MessageBubble message="Welcome to the" messageFontSize="text-7xl"/>
              <MessageBubble message="Social Media AU Creator" messageFontSize="text-8xl"/>
          </section>

          <section className= "flex flex-col gap-5 items-center text-xl">
              <MessageBubble message= "This is a website that handles all the time-consuming formatting for your social media AUs. You just worry about the story you're trying to tell, and we'll handle the rest!"
                             messageFontSize="text-xl"/>
          </section>

          <div className="flex flex-row gap-5 bg-white p-2 rounded-xl items-center self-center">
              <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button text="Sign Up!" onClick={handleSignupClick}/>
          </div>

      </div>
  );
}
