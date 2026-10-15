"use client";

import "@/app/_css/HeroSvgAnimation.css";

import Image from "next/image";
import React from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { animateSingleInputDesktop, animateSingleOutputDesktop, NodeAnim } from "../_animations";
import { NodeMeta } from "./SvgNode";
import { cn, randomFromArray } from "@/lib/utils";
import { inputFileSets, outputFileSets } from "../_constants";
import SvgInputs from "./SvgInputs";
import { Cog } from "lucide-react";

// Paths on the input side of the diagram (left)
export const inputPaths = [
  'M843.505 284.659L752.638 284.659C718.596 284.659 684.866 280.049 653.251 271.077L598.822 255.629L0.675021 1.00011',
  'M843.505 298.181L724.342 297.36C708.881 297.36 693.45 296.409 678.22 294.518L598.822 284.659C592.82 284.659 200.538 190.002 0.675028 164.892',
  'M843.505 311.703L701.108 310.061L598.822 305.136L0.675049 256.071',
  'M843.505 325.224L598.822 326.002L0.675049 321.858',
  'M843.505 338.746L701.108 340.388L598.822 345.442L0.675038 387.646',
  'M843.505 352.268L724.342 353.088C708.881 353.088 693.45 354.039 678.22 355.93L598.822 365.789L0.675067 478.825',
  'M843.505 365.789L752.638 365.789C718.596 365.789 684.866 370.399 653.251 379.372L598.822 394.82L0.675049 642.717',
];

// Paths on the output side of the diagram (right)
export const outputPaths = [
  'M843.325 1.00011L245.178 255.629L190.749 271.077C159.134 280.049 125.404 284.659 91.362 284.659L0.495 284.659',
  'M843.325 164.892L245.178 284.659L165.78 294.518C150.55 296.409 135.119 297.36 119.658 297.36L0.495 298.181',
  'M843.325 256.071L245.178 305.136L142.892 310.061L0.495 311.703',
  'M843.325 321.858L245.178 326.002L0.495 325.224',
  'M843.325 387.646L245.178 345.442L142.892 340.388L0.495 338.746',
  'M843.325 478.825L245.178 365.789L165.78 355.93C150.55 354.039 135.119 353.088 119.658 353.088L0.495 352.268',
  'M843.325 642.717L245.178 394.82L190.749 379.372C159.134 370.399 125.404 365.789 91.362 365.789L0.495 365.789',
];


export default function HeroSvgAnimation() {

  // Fast-changing animation state: plain mutable objects, never trigger renders.
  const [inputAnims] = React.useState(() => inputPaths.map(() => new NodeAnim()))
  const [outputAnims] = React.useState(() => outputPaths.map(() => new NodeAnim()))

  // Slow-changing state: labels/colors change once per loop, so React state is fine.
  const [inputMeta, setInputMeta] = React.useState<NodeMeta[]>(() => inputPaths.map(() => ({})))
  const [outputMeta, setOutputMeta] = React.useState<NodeMeta[]>(() => outputPaths.map(() => ({})))
  const [wiggleLogo, setWiggleLogo] = React.useState(false);
  const timeline = React.useRef<gsap.core.Timeline | null>(null);


  // We call render to sync values in JSX with (current) values in animation
  // Invoked by root timeline's `onUpdate` (every animation frame)
  const renderAllAnimations = React.useCallback(() => {
    [...inputAnims, ...outputAnims].forEach(animation => animation.render());
  }, [inputAnims, outputAnims]);

  /** Randomly selects a set of input file nodes and assigns them to input lines. */
  const prepareInputs = React.useCallback(() => {
    const inputFileSet = randomFromArray(inputFileSets);

    const lineIndexSet = new Set<number>();
    while (lineIndexSet.size < 3) {
      lineIndexSet.add(Math.floor(Math.random() * inputAnims.length));
    }

    // Assign each line its node label (uncolored files fall back to SvgNode's default colors)
    const lineIndexes = Array.from(lineIndexSet);
    setInputMeta(prev => {
      const next = [...prev];
      lineIndexes.forEach((lineIndex, fileIndex) => {
        const { label, color } = inputFileSet[fileIndex];
        next[lineIndex] = { label, dotColor: color, glowColor: color };
      });
      return next;
    });
    return lineIndexes;
  }, []);

  /** Randomly selects a set of output file nodes and assigns them to output lines. */
  const prepareOutputs = React.useCallback(() => {
    const outputFileSet = randomFromArray(outputFileSets);

    const lineIndexSet = new Set<number>();
    while (lineIndexSet.size < 3) {
      lineIndexSet.add(Math.floor(Math.random() * outputAnims.length));
    }

    // Assign each line its node label (uncolored files fall back to SvgNode's default colors)
    const lineIndexes = Array.from(lineIndexSet);
    setOutputMeta(prev => {
      const next = [...prev];
      lineIndexes.forEach((lineIndex, fileIndex) => {
        const { label, color } = outputFileSet[fileIndex];
        next[lineIndex] = { label, dotColor: color, glowColor: color };
      });
      return next;
    });
    return lineIndexes;
  }, []);

  // Main animation function
  const animateHero = React.useCallback(() => {
    // TODO: 
    console.log("[TODO] hero animation");

    timeline.current?.kill(); // drop the previous cycle completely

    // root timeline for the entire animation
    timeline.current = gsap.timeline({
      onComplete: animateHero,
      onUpdate: renderAllAnimations
    });

    prepareInputs().map((lineIndex, fileIndex) => {
      const node = inputAnims[lineIndex];
      timeline.current!.add(
        // isMobile ? animateSingleInputMobile(node) : animateSingleInputDesktop(node),
        animateSingleInputDesktop(node),
        // fileIndex * (isMobile ? 0.4 : 0.2),
        fileIndex * 0.2,
      );
    });

    // TODO: spinning cogs and indicate processing
    // timeline.current.call(() => setWiggleLogo(true), undefined, "<+0.3")
    timeline.current.call(() => setWiggleLogo(true), undefined, "=+0.3");
    timeline.current.set({}, {}, "+=2");

    timeline.current.addLabel("showOutput", "<");
    timeline.current.call(() => setWiggleLogo(false));

    prepareOutputs().map((lineIndex, fileIndex) => {
      const node = outputAnims[lineIndex];
      timeline.current!.add(
        // isMobile ? animateSingleInputMobile(node) : animateSingleInputDesktop(node),
        animateSingleOutputDesktop(node),
        // fileIndex * (isMobile ? 0.4 : 0.2),
        `showOutput+=${fileIndex * 0.2}`,
      );
    });

    // timeline.current.call(() => setWiggleLogo(false), undefined, '>-2')

    timeline.current.set({}, {}, '+=0.2')
  }, []);

  useGSAP(() => {
    // scroll-based trigger for first animation
    ScrollTrigger.create({
      trigger: "#hero-animation",
      start: "70% 100%",
      once: true,
      // markers: true,
      onEnter: animateHero
    });

  }, { dependencies: [animateHero] });

  React.useEffect(() => {
    timeline.current?.kill();
  }, []);

  return (
    <div id="hero-animation" className="w-full flex items-stretch relative">

      <SvgInputs paths={inputPaths} anims={inputAnims} meta={inputMeta} />

      {/* Center image container */}
      {/* <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 size-20 md:size-37.5"> */}
      <div
        className="
        flex items-center justify-center
        absolute z-50 top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        p-2 size-20 md:size-37.5
        rounded-2xl
        border border-white/70 dark:border-white/10
        bg-gradient-to-br
        from-white/80 via-white/30 to-slate-300/60
        dark:from-white/20 dark:via-white/[0.03] dark:to-white/15
        shadow-[0_0_12px_rgba(100,116,139,0.15)]
        dark:shadow-[0_0_20px_rgba(167,139,250,0.12)]
        before:pointer-events-none before:absolute before:inset-0
        before:rounded-2xl before:p-px
        before:bg-gradient-to-br
        before:from-white before:via-slate-300/30 before:to-transparent
        dark:before:from-white/70 dark:before:via-violet-300/20 dark:before:to-transparent
        before:content-['']
        "
      >
        {/* {wiggleLogo && <div className="-z-10 absolute inset-0 bg-primary/30 blur-md" />} */}


        <div
          className="
          absolute inset-0 z-5
          before:content-[''] after:content-['']
          before:absolute after:absolute
          before:inset-0 after:inset-0
          before:rounded-lg after:rounded-lg
          before:blur-[10px] after:blur-[8px]
          before:mix-blend-[color-dodge] after:mix-blend-[color-dodge]
          before:bg-[linear-gradient(-130deg,transparent_40%,rgba(154,152,222,0.6)_50%,transparent_60%)]
          after:bg-[linear-gradient(130deg,transparent_45%,rgba(154,152,222,0.7)_50%,transparent_60%)]
          before:bg-size-[400%] after:bg-size-[500%]
          before:animate-[shimmer_8s_linear_infinite]
          after:animate-[shimmer_6s_linear_infinite]
          "
        />

        <Image
          className={cn(
            "relative z-10 size-14 md:size-24",
            wiggleLogo && "animate-wiggle"
          )}
          src="/L1.png"
          alt="Image2Image logo"
          width={96}
          height={96}
          priority
        />

        <div
          className={cn(`
            absolute
            -left-16
            -top-16

            scale-100 opacity-100
            transition-[scale,opacity] duration-300 ease-out

            inline-flex items-center justify-center
            size-10 rounded-xl p-2
            border border-white/70 dark:border-white/10
            bg-gradient-to-br
            from-white/90 via-slate-100/70 to-slate-200/80
            dark:from-white/10 dark:via-white/[0.03] dark:to-violet-400/[0.08]
            shadow-sm shadow-slate-400/20
            dark:shadow-[0_2px_12px_rgba(139,92,246,0.12)]
            shiny-border
            animate-bounce
            `,
            wiggleLogo ? "starting:scale-100 starting:opacity-1" : "scale-0 opacity-0"
          )}
        >
          <Cog className="animate-spin size-5 text-slate-700 dark:text-slate-200" />
        </div>

        <div
          className={cn(`
            absolute
            -right-16
            -bottom-16

            scale-100 opacity-100
            transition-[scale,opacity] duration-300 ease-out
            starting:scale-75 starting:opacity-0

            inline-flex items-center justify-center
            size-10 rounded-xl p-2
            border border-white/70 dark:border-white/10
            bg-gradient-to-br
            from-white/90 via-slate-100/70 to-slate-200/80
            dark:from-white/10 dark:via-white/[0.03] dark:to-violet-400/[0.08]
            shadow-sm shadow-slate-400/20
            dark:shadow-[0_2px_12px_rgba(139,92,246,0.12)]
            shiny-border
            animate-bounce
            `,
            wiggleLogo ? "starting:scale-100 starting:opacity-1" : "scale-0 opacity-0"
          )}
        >
          <Cog className="animate-spin size-5 text-slate-700 dark:text-slate-200" />
        </div>

      </div>


      <SvgInputs paths={outputPaths} anims={outputAnims} meta={outputMeta} />

      {
        //       <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         //         width="800"
        //         //         height="600"
        //         //         viewBox="0 0 800 600"
        //         width="844"
        //         height="644"
        //         viewBox="0 0 844 644"
        //         fill="none"
        //       >
        //         <g className="output-lines">
        //           {outputPaths.map((outputPath, i) => (
        //             <path
        //               key={i}
        //               d={outputPath}
        //               stroke="black"
        //             />
        //           ))}
        //         </g>
        //         {/* Center image container */}
        //         {/* <g transform="translate(422 322)"> */}
        //         {/*   <rect */}
        //         {/*     x="-66" */}
        //         {/*     y="-66" */}
        //         {/*     width="132" */}
        //         {/*     height="132" */}
        //         {/*     rx="28" */}
        //         {/*     fill="var(--react-card-bg, #111827)" */}
        //         {/*     stroke="#61DAFB" */}
        //         {/*     strokeOpacity="0.6" */}
        //         {/*     strokeWidth="1.5" */}
        //         {/*   /> */}

        //         {/* React logo */}
        //         {/* <g transform="scale(1.25)" stroke="#61DAFB" strokeWidth="2.5"> */}
        //         {/*   <ellipse rx="24" ry="9" /> */}
        //         {/*   <ellipse rx="24" ry="9" transform="rotate(60)" /> */}
        //         {/*   <ellipse rx="24" ry="9" transform="rotate(120)" /> */}
        //         {/*   <circle r="3.5" fill="#61DAFB" stroke="none" /> */}
        //         {/* </g> */}
        //         {/* </g> */}
        //       </svg>
      }
    </div >
  );

  // return (
  //   <section style={{
  //     position: "relative",
  //     height: "100px"
  //   }}>
  //     <div style={{
  //       position: "absolute",
  //       insetBlock: 0,
  //       left: "50%",
  //       width: "100vw",
  //       transform: "translateX(-50%)",
  //       pointerEvents: "none",
  //       zIndex: 1,
  //       border: "1px solid black"
  //     }}>
  //     </div>
  //   </section>
  // );

  // return (
  //   <section style={{
  //     position: "relative"
  //   }} /*className="relative left-1/2 w-screen -translate-x-1/2" */
  //     className="h-32 border border-red-500f"
  //   >
  //     <div style={{
  //       position: "absolute",
  //       insetBlock: 0,
  //       left: "50%",
  //       width: "100vw",
  //       transform: "translateX(-50%)",
  //       pointerEvents: "none",
  //       zIndex: -1, /* or whatever suits your stacking */
  //     }}
  //       className="w-screen left-1/2 absolute border border-purple-500"
  //     >
  //       Test SVG
  //     </div>
  //
  //     {/* Full Width content */}
  //   </section >
  // );

  {/* Bleeds across the entire viewport */ }
  return (
    <div className="h-32 fixed inset-0 z-10 pointer-events-none w-screen" >
      <span>Full Width content</span>
      <div className="h-full w-full bg-blue-500/10" />
    </div>
  );

  // return (
  //   <div className="relative h-32 flex items-center items-stretch">
  //     <svg
  //
  //       xmlns="http://www.w3.org/2000/svg"
  //       //         width="800"
  //       //         height="600"
  //       //         viewBox="0 0 800 600"
  //       width="844"
  //       height="644"
  //       viewBox="0 0 844 644"
  //       fill="none"
  //       className="absolute inset-0 flex items-stretch border border-red-500"
  //     >
  //       <g className="input-lines">
  //         {inputPaths.map((inputPath, i) => (
  //           <path
  //             key={i}
  //             d={inputPath}
  //             stroke="black"
  //           />
  //         ))}
  //       </g>
  //
  //       <g className="output-lines">
  //         {outputPaths.map((outputPath, i) => (
  //           <path
  //             key={i}
  //             d={outputPath}
  //             stroke="black"
  //           />
  //         ))}
  //       </g>
  //
  //       {/* Center image container */}
  //       <g transform="translate(422 322)">
  //         <rect
  //           x="-66"
  //           y="-66"
  //           width="132"
  //           height="132"
  //           rx="28"
  //           fill="var(--react-card-bg, #111827)"
  //           stroke="#61DAFB"
  //           strokeOpacity="0.6"
  //           strokeWidth="1.5"
  //         />
  //
  //         {/* React logo */}
  //         <g transform="scale(1.25)" stroke="#61DAFB" strokeWidth="2.5">
  //           <ellipse rx="24" ry="9" />
  //           <ellipse rx="24" ry="9" transform="rotate(60)" />
  //           <ellipse rx="24" ry="9" transform="rotate(120)" />
  //           <circle r="3.5" fill="#61DAFB" stroke="none" />
  //         </g>
  //       </g>
  //     </svg>
  //   </div>
  // );

  return (
    <div className="relative isolate">
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="relative w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            //         width="800"
            //         height="600"
            //         viewBox="0 0 800 600"
            width="844"
            height="644"
            viewBox="0 0 844 644"
            fill="none"
            className="border border-red-500"
          >
            <g className="input-lines">
              {inputPaths.map((inputPath, i) => (
                <path
                  key={i}
                  d={inputPath}
                  stroke="black"
                />
              ))}
            </g>

            <g className="input-lines">
              {outputPaths.map((outputPath, i) => (
                <path
                  key={i}
                  d={outputPath}
                  stroke="black"
                />
              ))}
            </g>

            {/* Center image container */}
            <g transform="translate(422 322)">
              <rect
                x="-66"
                y="-66"
                width="132"
                height="132"
                rx="28"
                fill="var(--react-card-bg, #111827)"
                stroke="#61DAFB"
                strokeOpacity="0.6"
                strokeWidth="1.5"
              />

              {/* React logo */}
              <g transform="scale(1.25)" stroke="#61DAFB" strokeWidth="2.5">
                <ellipse rx="24" ry="9" />
                <ellipse rx="24" ry="9" transform="rotate(60)" />
                <ellipse rx="24" ry="9" transform="rotate(120)" />
                <circle r="3.5" fill="#61DAFB" stroke="none" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

