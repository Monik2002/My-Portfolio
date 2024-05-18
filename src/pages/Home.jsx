import { useContext } from "react";
import HeroSection from "../components/HeroSection";
import HighlightSection from "../components/HighlightsSection";
import ProjectsSection from "../components/ProjectsSection";
import { ThemeContext } from "../components/ThemeContext";

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <main className={`${isDarkMode ? "dark" : ""}`}>
      <div
        className={`${
          isDarkMode
            ? "dark:bg-dark-bg dark:text-dark-text"
            : "bg-white text-black"
        }`}
      >
        <HeroSection />
        <div className="container">
          <HighlightSection />
          <ProjectsSection />
        </div>
      </div>
    </main>
  );
};

export default Home;
