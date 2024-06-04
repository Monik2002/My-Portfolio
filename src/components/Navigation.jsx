import { useEffect } from "react";
import Shepherd from "shepherd.js";
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

  useEffect(() => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: "shepherd-theme-arrows",
        scrollTo: { behavior: "smooth", block: "center" },
      },
    });

    tour.addStep({
      id: "home-step",
      text: "This is the Home page where you can get an overview of my portfolio.",
      attachTo: { element: ".home", on: "bottom" },
      buttons: [
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      id: "about-step",
      text: "This is the About page where you can learn more about me.",
      attachTo: { element: ".about", on: "bottom" },
      buttons: [
        {
          text: "Next",
          action: tour.next,
        },
        {
          text: "Back",
          action: tour.back,
        },
      ],
    });

    // Add more steps for other navigation items...
    tour.addStep({
      id: "projects-step",
      text: "This is the Projects page where you can see my projects.",
      attachTo: { element: ".projects", on: "bottom" },
      buttons: [
        {
          text: "Next",
          action: tour.next,
        },
        {
          text: "Back",
          action: tour.back,
        },
      ],
    });

    tour.addStep({
      id: "contact-step",
      text: "This is the Contact page where you can contact me.",
      attachTo: { element: ".contact", on: "bottom" },
      buttons: [
        {
          text: "Next",
          action: tour.next,
        },
        {
          text: "Back",
          action: tour.back,
        },
      ],
    });

    tour.addStep({
      id: "github-step",
      text: "This is the GitHub link where you can see my repositories.",
      attachTo: { element: ".git-hub", on: "bottom" },
      buttons: [
        {
          text: "Done",
          action: tour.next,
        },
        {
          text: "Back",
          action: tour.back,
        },
      ],
    });

    tour.start();

    return () => {
      tour.complete();
    };
  }, []);

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
