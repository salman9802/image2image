"use client";
import React from "react";

const DOT_COUNT = 3;

export default function AnimatedProcessing() {
  const [dotCount, setDotCount] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount(prev => (prev + 1) % (DOT_COUNT + 1));
    }, 500);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return (
    <div>Processing{".".repeat(dotCount)}</div>
  )
}

