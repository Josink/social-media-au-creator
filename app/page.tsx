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

          <section className = "flex flex-row gap-10 pt-10 pb-5">

              <section className = "flex flex-col gap-20 items-end w-1/4">
                  <section className="flex flex-col gap-5 items-center">
                      <MessageBubble message="Create" messageFontSize="text-lg" from="user"/>
                      <MessageBubble message="Create your online world with all your favorite characters!" messageFontSize="text-lg" from="website"/>
                  </section>

                  <section className="flex flex-col gap-5 items-center">
                      <MessageBubble message="Customize" messageFontSize="text-lg" from="user"/>
                      <MessageBubble message="Customize your AU! Customise characters profiles, their pages, their platforms, and more!" messageFontSize="text-lg" from="website"/>
                  </section>
              </section>

              <section className="flex flex-col gap-20 items-center justify-center w-1/2">

                  <div className = "flex flex-col gap-5">
                      <div className="flex flex-col gap-5 items-center">
                          <h1 className="text-6xl">Social Media AU&#39;s</h1>
                          <h1 className="text-6xl text-accent">Made Easy</h1>
                      </div>

                      <h6 className="text-xl">The solution for those who just want to create, not build.</h6>
                  </div>

                  <div className="flex flex-row gap-5 bg-white p-2 rounded-xl items-center max-w-max">
                      <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <Button text="Sign Up!" onClick={handleSignupClick}/>
                  </div>
              </section>

              <section className = "flex flex-col gap-5 w-1/4 pt-16">
                  <MessageBubble message="Share" messageFontSize="text-lg" from="user"/>
                  <MessageBubble message="Share your AU with others! Whether in the form of an image or html code, we got you." messageFontSize="text-lg" from="website"/>
              </section>
          </section>
      </div>
  );
}
