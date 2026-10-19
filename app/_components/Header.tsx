"use client";

import { useTheme } from "@/contexts/theme";
import { cn } from "cn";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 bg-primary flex justify-between items-center">
      <Link href="/" className="w-fit text-neutral-500">
        <Image
          src="/image2image-logo.svg"
          alt="Logo"
          width="100"
          height="44"
          className="w-auto invert"
        />
      </Link>

      <div className="w-fit flex items-center gap-4">

        <div className="w-fit border border-neutral-50 p-2 tabular-nums text-neutral-50">
          {process.env.NEXT_PUBLIC_APP_VERSION}
        </div>

        <Link href="https://github.com/salman9802/image2image" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center justify-center gap-2 p-2 text-neutral-50 hover:opacity-90">
          <FaGithub className="size-5" />
          <span className="font-semibold">Github</span>
        </Link>

        <div className="relative w-fit bg-background p-3 flex gap-6 before:content-[''] before:absolute before:inset-y-0 before:w-1/2 before:left-0 before:z-10 before:bg-accent">
          <Sun
            onClick={() => {
              if (theme !== "light") setTheme("light");
            }}
            className={cn("size-5 z-50 cursor-pointer", theme === "light" && "bg-accent")}
          />
          <Moon
            onClick={() => {
              if (theme !== "dark") setTheme("dark");
            }}
            className={cn("size-5 z-50 cursor-pointer", theme === "dark" && "bg-accent")}
          />
        </div>

      </div>
    </div>
  );
}
