"use client";

import React from "react";
import { NodeAnim } from "../_animations";
import SvgNode, { NodeMeta } from "./SvgNode";

type TSvgInputsProps = {
  paths: string[];
  anims: NodeAnim[];
  meta: NodeMeta[];
}

const SvgInputs = ({ paths, anims, meta }: TSvgInputsProps) => {
  const gradientId = `base_gradient_${React.useId().replace(/:/g, '')}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="844"
      height="644"
      viewBox="0 0 844 644"
      fill="none"
      className="block h-auto w-full"
    >
      {paths.map((inputPath, i) => (
        <g key={i}>
          <path
            key={i}
            d={inputPath}
            stroke={`url(#${gradientId})`}
          />
          <SvgNode path={inputPath} anim={anims[i]} {...meta[i]} />
        </g>
      ))}

      <defs>
        <linearGradient
          id={gradientId}
          x1={88.1032}
          y1={324.167}
          x2={843.505}
          y2={324.167}
          gradientUnits="userSpaceOnUse"
        >
          {/* <stop offset={0} stopColor="#c6caff" stopOpacity={0} /> */}
          {/* <stop offset={0.2} stopColor="#c6caff" stopOpacity={0.1} /> */}
          {/* <stop offset={0.4} stopColor="white" stopOpacity={0.4} /> */}
          {/* <stop offset={0.6} stopColor="#c6caff" stopOpacity={0.2} /> */}
          {/* <stop offset={0.8} stopColor="#c6caff" stopOpacity={0.2} /> */}
          {/* <stop offset={0.9} stopColor="#c6caff" stopOpacity={0} /> */}

          <stop offset={0} style={{ stopColor: 'var(--line-color)' }} stopOpacity={0} />
          <stop offset={0.2} style={{ stopColor: 'var(--line-color)' }} stopOpacity={0.1} />
          <stop offset={0.4} style={{ stopColor: 'var(--line-highlight)' }} stopOpacity={0.4} />
          <stop offset={0.6} style={{ stopColor: 'var(--line-color)' }} stopOpacity={0.2} />
          <stop offset={0.8} style={{ stopColor: 'var(--line-color)' }} stopOpacity={0.2} />
          <stop offset={0.9} style={{ stopColor: 'var(--line-color)' }} stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default SvgInputs
