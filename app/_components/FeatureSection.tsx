"use client";

import { Separator } from "@/components/ui/separator"
import { Cpu, FileCheck, FileImage, Server, X } from "lucide-react";
import React from "react";
import { PiFileFill } from "react-icons/pi";

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

const FeatureSection = () => {
  return (
    <div className="w-11/12 mx-auto my-24 font-mono flex gap-6 flex-col md:flex-row md:gap-12 md:w-3/4 lg:w-4/5">

      {/* Left/Top section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-lg md:text-xl lg:text-2xl">There's no server to send it to.</h1>
          <p className="text-muted-foreground">This tool is a static site. Privacy isn't a policy you have to trust, it's how the thing is built.</p>
        </div>

        <Separator />
        {FEATURES.map((feature, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col gap-1 mb-1">
              <h2 className="font-semibold text-lg lg:text-xl">{feature.title}</h2>
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
          <div className="border border-primary relative flex items-center p-16">
            <span className="absolute -top-3 left-4 text-primary px-2 bg-neutral-50 dark:bg-black">Your device</span>

            <div className="relative flex flex-col gap-2">
              <div className="border border-border p-6">
                <FileImage className="size-6" />
              </div>
              <span className="absolute -bottom-8 text-nowrap text-sm">Your file</span>
            </div>

            <DiagramHorizontalLine />

            <div className="relative flex flex-col gap-2">
              <div className="border border-border p-6">
                <Cpu className="size-6" />
              </div>
              <span className="absolute -bottom-8 text-nowrap text-sm">Converter</span>
              <span className="absolute -bottom-12 text-muted-foreground text-nowrap text-xs">Web Worker</span>
            </div>

            <DiagramHorizontalLine />

            <div className="relative flex flex-col gap-2">
              <div className="border border-border p-6">
                <FileCheck className="size-6" />
              </div>
              <span className="absolute -bottom-8 text-nowrap text-sm">Result</span>
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

            <div className="flex items-center justify-between">
              <p className="font-semibold text-muted-foreground flex items-center gap-2">
                <span>banner.png</span>
                <span className="font-normal">to</span>
                <span>webp</span>
              </p>
              <p className="text-green-500 tabular-nums">63 ms</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-muted-foreground flex items-center gap-2">
                <span>scan.tiff</span>
                <span className="font-normal">to</span>
                <span>jpeg</span>
              </p>
              <p className="text-green-500 tabular-nums">240 ms</p>
            </div>

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
