"use client";

import React from "react";
import { NodeAnim } from "../_animations";
import { setAttrs } from "@/lib/utils";
import { gsap } from "@/lib/gsap";

const GLOW_RADIUS = 30;
const DOT_RADIUS = 3;

/** The slow-changing, React-owned part of a node (changes once per loop). */
export interface NodeMeta {
  label?: string
  glowColor?: string
  dotColor?: string
}

type TSvgNodeProps = {
  path: string;
  anim: NodeAnim;
} & NodeMeta;

const SvgNode = ({
  path,
  anim,
  label,
  glowColor = "oklch(0.432 0.232 292.759)",
  dotColor = "oklch(0.432 0.232 292.759)"
}: TSvgNodeProps) => {
  const uid = React.useId();

  const pathRef = React.useRef<SVGPathElement>(null)
  const dotRef = React.useRef<SVGCircleElement>(null)
  const labelRef = React.useRef<SVGTextElement>(null)
  const gradientRef = React.useRef<SVGRadialGradientElement>(null)
  const maskCircleRef = React.useRef<SVGCircleElement>(null)

  React.useEffect(() => {
    const pathEl = pathRef.current;
    if (pathEl == null) return;
    const length = pathEl.getTotalLength();

    // Tweened helper values
    const glow = { scale: 0 };
    const dot = { radius: 0 };

    let lastPosition = NaN, lastVisible = false, lastLabelVisible = false;

    const applyGlow = () => {
      const r = GLOW_RADIUS * glow.scale;
      setAttrs(gradientRef.current, { r });
      setAttrs(maskCircleRef.current, { r });
    }
    const applyDot = () => setAttrs(dotRef.current, { r: dot.radius });

    // Main animation loop (called by gsap timeline's `onUpdate`)
    // We do (1 - position) since svg is built in reverse direction
    const render = () => {
      // TODO: 

      if (anim.position !== lastPosition) {
        lastPosition = anim.position;
        const { x, y } = pathEl.getPointAtLength((1 - anim.position) * length);
        setAttrs(dotRef.current, { cx: x, cy: y });
        setAttrs(maskCircleRef.current, { cx: x, cy: y });
        setAttrs(gradientRef.current, { cx: x, cy: y });
        setAttrs(labelRef.current, { x: x, y: y + 15 }); // text will be 15 below everything else
      }

      if (anim.visible !== lastVisible) {
        lastVisible = anim.visible;
        gsap.to(glow, {
          duration: 0.5,
          ease: "power2.inOut",
          scale: anim.visible ? 1 : 0,
          onUpdate: applyGlow
        });
        gsap.to(dot, {
          duration: 0.6,
          ease: "power2.inOut",
          radius: anim.visible ? DOT_RADIUS : 0,
          onUpdate: applyDot
        });
      }

      if (anim.labelVisible !== lastLabelVisible) {
        lastLabelVisible = anim.labelVisible;
        // labelRef.current?.classList.toggle("opacity-100");
        if (labelRef.current == undefined) return;
        if (anim.labelVisible) {
          labelRef.current.style.opacity = "100%";
        } else {
          labelRef.current.style.opacity = "0%";
        }

      }
    }

    applyGlow();
    applyDot();
    render();
    const unsubscribe = anim.subscribe(render);

    return () => {
      unsubscribe();
      gsap.killTweensOf([glow, dot]);
    }
  }, [path, anim]);

  return (
    <g>
      <path
        ref={pathRef}
        d={path}
        stroke={`url(#glow_gradient_${uid})`}
        strokeWidth={1.2}
        mask={`url(#glow_mask_${uid})`}
        className=""
      />

      <circle
        ref={dotRef}
        fill={dotColor}
        style={{ "--dot-color": dotColor ?? "white" } as React.CSSProperties}
        className="hidden md:drop-shadow-[0_0_3px_var(--dot-color)] md:block"
      />

      <text
        ref={labelRef}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontStyle="normal"
        // fontFamily="Inter, sans-serif"
        className="fill-muted-foreground text-sm opacity-0 transition-opacity ease-in-out duration-[400ms] hidden will-change-[opacity] lg:block"
      >
        {label}
      </text>

      <defs>
        <mask id={`glow_mask_${uid}`}>
          <path d={path} fill="black" />
          <circle ref={maskCircleRef} fill="white" />
        </mask>
        <radialGradient
          ref={gradientRef}
          id={`glow_gradient_${uid}`}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={glowColor} stopOpacity={1} />
          <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
        </radialGradient>
      </defs>
    </g>
  )
}

export default SvgNode
