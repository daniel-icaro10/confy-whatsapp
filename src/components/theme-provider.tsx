"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type AccentColor = "indigo" | "blue" | "violet" | "teal" | "rose" | "graphite" | "emerald";
export type DensityMode = "comfortable" | "compact";
export type MotionMode = "system" | "reduce";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
  motion: MotionMode;
  setMotion: (motion: MotionMode) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "gr8r_theme_prefs";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<AccentColor>("indigo");
  const [density, setDensityState] = useState<DensityMode>("comfortable");
  const [motion, setMotionState] = useState<MotionMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setThemeState(parsed.theme);
        if (parsed.accent) setAccentState(parsed.accent);
        if (parsed.density) setDensityState(parsed.density);
        if (parsed.motion) setMotionState(parsed.motion);
      }
    } catch {
      // ignore JSON errors
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ theme, accent, density, motion })
      );
    } catch {
      // storage unavailable
    }

    const root = document.documentElement;

    // Resolve system vs explicit theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemIsDark = mediaQuery.matches;
    const isDark = theme === "dark" || (theme === "system" && systemIsDark);

    setResolvedTheme(isDark ? "dark" : "light");

    if (theme === "system") {
      root.removeAttribute("data-theme");
      if (systemIsDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.setAttribute("data-theme", "light");
      root.classList.remove("dark");
    }

    // Set accent
    root.setAttribute("data-accent", accent);

    // Set density
    if (density === "compact") {
      root.setAttribute("data-density", "compact");
      root.setAttribute("data-side", "compact");
    } else {
      root.removeAttribute("data-density");
      root.removeAttribute("data-side");
    }

    // Set motion
    if (motion === "reduce") {
      root.setAttribute("data-motion", "reduce");
    } else {
      root.removeAttribute("data-motion");
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        if (e.matches) {
          root.classList.add("dark");
          setResolvedTheme("dark");
        } else {
          root.classList.remove("dark");
          setResolvedTheme("light");
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, accent, density, motion, mounted]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setAccent = (a: AccentColor) => setAccentState(a);
  const setDensity = (d: DensityMode) => setDensityState(d);
  const setMotion = (m: MotionMode) => setMotionState(m);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent,
        density,
        setDensity,
        motion,
        setMotion,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
