import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "alxztxppunfkrefcifgb.supabase.co",
                pathname: "/storage/v1/object/sign/character-avatars/**",
            },
        ],
    },};

export default nextConfig;
