"use client";

import { Button } from "@/components/ui/button";
import HeroSvgAnimation from "./HeroSvgAnimation";

export default function HeroSection() {
  return (
    <div className="w-full flex flex-col gap-4 items-center text-center lg:gap-6">
      <h1 className="font-mono text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-violet-500 to-pink-500 sm:text-5xl lg:text-6xl">
        Transform Images.
        <br />
        Your Way.
      </h1>
      <p className="font-mono mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        Convert images betweeen formats in seconds. Free, simple, and right in your browser.
      </p>
      <Button className="mt-4 font-mono text-lg px-6 py-3">Get Started</Button>
      <p className="-mt-3 text-muted-foreground text-sm font-mono">No signup required.</p>

      {/* <Image */}
      {/*   className="dark:invert h-5 w-[100px]" */}
      {/*   src="/L1.png" */}
      {/*   alt="Image2Image logo" */}
      {/*   width={100} */}
      {/*   height={20} */}
      {/*   priority */}
      {/* /> */}

      <HeroSvgAnimation />

    </div>
  )
}

