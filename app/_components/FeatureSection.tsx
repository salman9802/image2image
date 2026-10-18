"use client";

import { Separator } from "@/components/ui/separator"
import { Cpu, FileCheck, FileImage, Server, X } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";

type TFeature = {
  title: string;
  content: string;
}
const FEATURES: TFeature[] = [
  {
    title: "Nothing is uploaded",
    content: "Conversions runs in your browser, on your device. There's no upload step because there's no server to upload to."
  },
  {
    title: "No accounts, no database.",
    content: "The site is static files. With nothing stored on our side, there's nothing to breach or leak."
  },
  {
    title: "Check it yourself.",
    content: "Open your browser's network tab and convert a file.You'll see requests for the page and it's code, never your files."
  },
  {
    title: "Converts many files at once.",
    content: "Each file is handled by its own background worker via browser's Web Worker API, so a batch doesn't freeze your page and conversions are fast."
  }
];

const CONVERSIONS = [
  { from: "photo.heic", to: "png", ms: 412 },
  { from: "banner.png", to: "webp", ms: 96 },
  { from: "logo.svg", to: "ico", ms: 38 },
  { from: "scan.tiff", to: "jpeg", ms: 240 },
  { from: "shot.avif", to: "png", ms: 130 },
];

type TFeedLine = typeof CONVERSIONS[number] & { id: number; };

const FeatureSection = () => {
  const [feed, setFeed] = React.useState<TFeedLine[]>([{ id: 0, ...(CONVERSIONS[0]) }]);

  const firstDotRef = React.useRef<null | HTMLDivElement>(null);
  const secondDotRef = React.useRef<null | HTMLDivElement>(null);

  useGSAP(() => {
    let n = 0;
    const tl = gsap.timeline({ repeat: -1 });

    tl.set({}, {}, "+=1");
    tl.call(() => {
      const r = Math.random();
      gsap.set(firstDotRef.current, {
        rotate: r < 0.5 ? 45 : 0,
      });
      gsap.set(secondDotRef.current, {
        rotate: r >= 0.5 ? 45 : 0,
      });
    });
    // tl.call(() => setWiggleLogo(true), undefined, "=+0.3");

    tl.fromTo(firstDotRef.current,
      {
        left: "-10%",
      },
      {
        left: "110%",
        duration: 0.5
      }
    );

    tl.fromTo(secondDotRef.current,
      {
        left: "-10%",
      },
      {
        left: "110%",
        duration: 0.5,
        delay: 0.3
      }
    );

    tl.call(() => {
      n++;
      setFeed(prev => ([...prev, { id: n, ...CONVERSIONS[n % CONVERSIONS.length] }].slice(-3)));
    });

  }, { dependencies: [] });

  return (
    <div className="w-11/12 mx-auto my-24 font-mono flex gap-6 flex-col md:flex-row md:gap-12 md:w-3/4 lg:w-4/5">

      {/* Left/Top section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">There's no server to send it to.</h1>
          <p className="text-muted-foreground">This tool is a static site. Privacy isn't a policy you have to trust, it's how the thing is built.</p>
        </div>

        <Separator />
        {FEATURES.map((feature, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col gap-1 mb-1">
              <h2 className="font-semibold lg:text-xl">{feature.title}</h2>
              <p className="text-muted-foreground">{feature.content}</p>
            </div>

            <Separator />
          </React.Fragment>
        ))}

      </div>

      {/* Right/Bottom section */}
      <div className="flex-1 border border-border *:p-4 divide-y divide-border *:w-full flex flex-col items-center">

        {/* Top */}
        <div className="flex flex-col">
          {/* Your device section */}
          <div className="border border-primary relative flex items-center py-16 px-4 md:px-12 lg:px-16">
            <span className="absolute -top-3 left-4 text-primary px-2 bg-neutral-50 dark:bg-black">Your device</span>

            <div className="relative flex flex-col gap-2">
              <div className="z-20 bg-background border border-border p-2 md:p-6">
                <FileImage className="size-6" />
              </div>
              <span className="absolute -bottom-8 text-nowrap text-xs md:text-sm">Your file</span>
            </div>

            <div className="w-full relative">
              <DiagramHorizontalLine />
              <div ref={firstDotRef} className="absolute size-3 bg-primary top-1/2 -translate-y-1/2 left-full z-10" />
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="z-20 bg-background border border-border p-2 md:p-6">
                <Cpu className="size-6" />
              </div>
              <span className="absolute -bottom-8 text-nowrap text-xs md:text-sm">Converter</span>
              <span className="absolute -bottom-12 text-muted-foreground text-nowrap text-[8px] md:text-xs">Web Worker</span>
            </div>

            <div className="w-full relative">
              <DiagramHorizontalLine />
              <div ref={secondDotRef} className="absolute size-3 bg-primary top-1/2 -translate-y-1/2 left-full z-10" />
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="z-20 bg-background border border-border p-2 md:p-6">
                <FileCheck className="size-6" />
              </div>
              <span className="absolute -bottom-8 text-nowrap text-xs md:text-sm">Result</span>
            </div>


          </div>

          {/* Middle */}
          <div className="relative p-0! flex items-center justify-center">
            <div className="w-px h-24 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-border p-2 bg-neutral-50 dark:bg-black">
              <X className="size-4 text-muted-foreground" />
            </div>
          </div>

          {/* Bottom */}
          <div className="border border-border p-6 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_6px,var(--border)_6px,var(--border)_7px)] flex items-center justify-center">
            <div className="bg-secondary flex items-center justify-center gap-1 px-4">
              <Server className="size-5" />
              <span className="p-2">No server</span>
            </div>
          </div>

        </div>


        {/* Bottom */}
        <div className="flex flex-col gap-4">
          <span className="text-muted-foreground">Converter Log</span>

          {/* Conversion Logs */}
          <div className="flex flex-col gap-2">

            {feed.map((feed) => (
              <motion.div
                key={feed.id}
                initial={{ opacity: 0, y: 4 }}
                whileInView={"animate"}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between"
              >
                <p className="font-semibold text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">{feed.from}</span>
                  <span className="font-normal">to</span>
                  <span className="text-primary">{feed.to}</span>
                </p>
                <p className="text-green-500 tabular-nums">{feed.ms} ms</p>
              </motion.div>
            ))}
          </div>

          <div className="my-2">
            <DiagramHorizontalLine />
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-muted-foreground">
              Network
            </p>
            <p className="text-green-500 tabular-nums">
              0 requests, 0 B sent
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default FeatureSection

// ========================= Local Components =========================

function DiagramHorizontalLine() {
  return (
    <div className="h-px w-full bg-border" />
  );
}
