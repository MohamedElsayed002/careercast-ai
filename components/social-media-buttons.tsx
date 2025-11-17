"use client";

import { authClient } from "@/utils/auth-client";
import Image from "next/image";
import { Button } from "./ui/button";

export const SocialMediaButtons = () => {

    const signInWithGitHub = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                type="button"
                onClick={signInWithGitHub}
            >
                <Image
                    src="/logo/github.svg"
                    width={20}
                    height={20}
                    alt="Github"
                />
                Continue with Github
            </Button>
        </div>
    );
};
