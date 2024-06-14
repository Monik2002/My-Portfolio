import { useContext } from "react";
import { NavLink } from "react-router-dom";
import search from "../assets/nav-search.png";
import floppy from "../assets/nav-floppy.png";
import github from "../assets/nav-github.png";
import projects from "../assets/nav-projects.png";
import blog from "../assets/nav-blog.png";
import moon from "../assets/moon.png";
import { ThemeContext } from "./ThemeContext";

const Navigation = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <section
      className={`navigation ${
        isDarkMode
          ? "dark:bg-dark-bg dark:text-dark-text"
          : "bg-white text-black"
      }`}
    >
      <div className="container">
        <nav>
          <div className="nav-item-outer">
            <NavLink className="item home " to="/" aria-current="page">
              <img src={floppy} alt="Home" className="nav-image" />
              <span>Home</span>
            </NavLink>
          </div>
          <div className="nav-item-outer">
            <NavLink className="item about" to="/me">
              <img src={search} alt="About" className="nav-image" />
              <span>About</span>
            </NavLink>
          </div>

          <div className="nav-item-outer">
            <NavLink className="item projects" to="/projects">
              <img src={projects} alt="Projects" className="nav-image" />
              <span>Projects</span>
            </NavLink>
          </div>
          <div className="nav-item-outer">
            <NavLink className="item contact" to="/contact">
              <img src={blog} alt="Contact" className="nav-image" />
              <span>Contact</span>
            </NavLink>
          </div>
          <div className="nav-item-outer">
            <a
              href="https://github.com/Monik2002"
              className="desktop-only item git-hub"
              target="_blank"
              rel="noreferrer"
            >
              <img src={github} alt="GitHub" className="nav-image" />
              <span>GitHub</span>
            </a>
          </div>
        </nav>
        <div className="theme-toggle">
          <button onClick={toggleDarkMode}>
            <img src={moon} alt="Theme" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Navigation;
