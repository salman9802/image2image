"use client";

/** The slow-changing, React-owned part of a node (changes once per loop). */
export interface NodeMeta {
  label?: string
  glowColor?: string
  dotColor?: string
}

