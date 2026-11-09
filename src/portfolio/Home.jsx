"use client";

import { useContext } from "react";
import HeroSection from "../components/HeroSection";
import HighlightSection from "../components/HighlightsSection";
import ProjectsSection from "../components/ProjectsSection";
import { ThemeContext } from "../components/ThemeContext";

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <main className={`${isDarkMode ? "dark" : ""}`}>
      <div className="home-content">
        <HeroSection />
        <div className="container">
          <ProjectsSection />
          <HighlightSection />
        </div>
      </div>
    </main>
  );
};

export default Home;
