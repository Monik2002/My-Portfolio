"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import search from "../assets/nav-search.png";
import floppy from "../assets/nav-floppy.png";
import github from "../assets/nav-github.png";
import projects from "../assets/nav-projects.png";
import blog from "../assets/nav-blog.png";
import moon from "../assets/moon.png";
import { ThemeContext } from "./ThemeContext";

const Navigation = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const pathname = usePathname();

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
            <Link
              className={`item home ${pathname === "/" ? "active" : ""}`}
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              aria-label="Home"
            >
              <Image src={floppy} alt="" className="nav-image" />
              <span>Home</span>
            </Link>
          </div>
          <div className="nav-item-outer">
            <Link
              className={`item about ${pathname === "/me" ? "active" : ""}`}
              href="/me"
              aria-current={pathname === "/me" ? "page" : undefined}
              aria-label="About"
            >
              <Image src={search} alt="" className="nav-image" />
              <span>About</span>
            </Link>
          </div>

          <div className="nav-item-outer">
            <Link
              className={`item projects ${pathname === "/projects" ? "active" : ""}`}
              href="/projects"
              aria-current={pathname === "/projects" ? "page" : undefined}
              aria-label="Projects"
            >
              <Image src={projects} alt="" className="nav-image" />
              <span>Projects</span>
            </Link>
          </div>
          <div className="nav-item-outer">
            <Link
              className={`item contact ${pathname === "/contact" ? "active" : ""}`}
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              aria-label="Contact"
            >
              <Image src={blog} alt="" className="nav-image" />
              <span>Contact</span>
            </Link>
          </div>
          <div className="nav-item-outer">
            <a
              href="https://github.com/Monik2002"
              className="desktop-only item git-hub"
              target="_blank"
              rel="noreferrer"
            >
              <Image src={github} alt="GitHub" className="nav-image" />
              <span>GitHub</span>
            </a>
          </div>
        </nav>
        <div className="theme-toggle">
          <button type="button" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            <Image src={moon} alt="" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Navigation;
