"use client";

import React from "react";

export type TTheme = "light" | "dark";

export type TThemeContext = {
  theme: TTheme;
  // setTheme: (theme: TTheme) => any;
  setTheme: React.Dispatch<React.SetStateAction<TTheme>>;
}

const ThemeContext = React.createContext<TThemeContext | null>(null);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<TTheme>("light");

  React.useEffect(() => {
    const systemTheme: TTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(systemTheme);
  }, []);

  React.useEffect(() => {
    if (theme === "light")
      document.documentElement.classList.remove("dark");
    else
      document.documentElement.classList.add("dark");
  }, [theme]);

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
