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

          <section className= "flex flex-col gap-10 items-center pt-10 pb-5">
              <div className = "flex flex-col gap-5 items-center">
                  <h1 className="text-6xl">Social Media AU&#39;s</h1>
                  <h1 className="text-6xl">Made Easy</h1>
              </div>
              <h6 className = "text-xl text-secondary/60">The solution for those who just want to create, not build.</h6>
          </section>

          <section className= "flex flex-col gap-5">
              <MessageBubble message= "This is a website that handles all the time-consuming formatting for your social media AUs. You just worry about the story you're trying to tell, and we'll handle the rest!"
                             messageFontSize="text-xl" from = "website" textingDuration = {4000}/>

              <MessageBubble message = "Sign Up?" messageFontSize ="text-lg" from = "website" textingDuration = {5000}></MessageBubble>

              <div className="flex flex-row gap-5 bg-white p-2 rounded-xl items-center self-end max-w-max">
                  <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button text="Sign Up!" onClick={handleSignupClick}/>
              </div>
          </section>
      </div>
  );
}
