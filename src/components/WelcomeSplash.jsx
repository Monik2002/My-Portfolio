"use client";

import { useEffect, useRef, useState } from "react";
import {
  markWelcomeShown,
  shouldShowWelcome,
} from "../lib/welcome-session";

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const splashRef = useRef(null);

  useEffect(() => {
    let shouldAnimateWelcome;
    let welcomeStorage;
    try {
      welcomeStorage = window.sessionStorage;
      shouldAnimateWelcome = shouldShowWelcome(
        welcomeStorage,
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (error) {
      console.error("Could not read or save the welcome-screen session.", error);
      shouldAnimateWelcome = true;
    }

    if (!shouldAnimateWelcome) return undefined;

    let showFrame;
    let leaveFrame;
    showFrame = window.requestAnimationFrame(() => {
      if (welcomeStorage) {
        try {
          markWelcomeShown(welcomeStorage);
        } catch (error) {
          console.error("Could not save the welcome-screen session.", error);
        }
      }
      setIsVisible(true);
      leaveFrame = window.requestAnimationFrame(() => setIsLeaving(true));
    });

    return () => {
      window.cancelAnimationFrame(showFrame);
      if (leaveFrame !== undefined) window.cancelAnimationFrame(leaveFrame);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={splashRef}
      aria-hidden="true"
      className={`welcome-splash${isLeaving ? " welcome-splash--leaving" : ""}`}
      onAnimationEnd={(event) => {
        if (event.target === splashRef.current) {
          setIsVisible(false);
        }
      }}
    >
      <h1>Welcome.</h1>
    </div>
  );
}
