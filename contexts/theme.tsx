"use client";

import { getItem, setItem } from "@/lib/localstorage";
import React from "react";

// NOTE: when changing this value, also update root layout head's script tag
// It isn't referenced there to prevent theme flashing
export const THEME_STORAGE_KEY = "thi2i";

export type TTheme = "light" | "dark";

export type TThemeContext = {
  theme: TTheme;
  // setTheme: (theme: TTheme) => any;
  setTheme: React.Dispatch<React.SetStateAction<TTheme>>;
}

const ThemeContext = React.createContext<TThemeContext | null>(null);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [isInitalized, setIsInitialized] = React.useState(false);
  const [theme, setTheme] = React.useState<TTheme>("dark");

  React.useEffect(() => {
    // const userTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const userTheme = getItem(THEME_STORAGE_KEY);

    const initialTheme = (userTheme === "light" || userTheme === "dark")
      ? userTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    if (!isInitalized) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    // localStorage.setItem(THEME_STORAGE_KEY, theme);
    setItem(THEME_STORAGE_KEY, theme);

    // if (theme === "light") {
    //   document.documentElement.classList.remove("dark");
    //   localStorage.setItem(THEME_STORAGE_KEY, "light");
    // }
    // else {
    //   document.documentElement.classList.add("dark");
    //   localStorage.setItem(THEME_STORAGE_KEY, "dark");
    // }
  }, [theme, isInitalized]);

  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

// function readSystemPreference(): TTheme {
//   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
// }

export function useTheme() {
  const themeContext = React.useContext(ThemeContext);
  if (themeContext == null) {
    throw new Error("Error: useTheme() hook can only be used inside ThemeContextProvider.");
  }
  return themeContext;
}

// ========================= Smooth theme transitioning =========================

export function transitionTheme(
  event: React.MouseEvent<any>,
  theme: TTheme,
  setTheme: React.Dispatch<React.SetStateAction<TTheme>>
) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  const applyTheme = () => {
    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );

    setTheme(nextTheme);
  }

  // Check for browser support
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    applyTheme();
    return;
  }

  const { clientX: x, clientY: y } = event;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    applyTheme();
  });

  transition.ready.then(() => {
    document.documentElement.animate({
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${radius}px at ${x}px ${y}px)`
      ]
    },
      {
        duration: 500,
        easing: "ease-in",
        pseudoElement: "::view-transition-new(root)"
      }
    );
  });
}
