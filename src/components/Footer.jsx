// import React from "react";
import github from "../assets/nav-github.png";
import floppylogo from "../assets/floppylogo.png";
import twitterlogo from "../assets/twitterlogo.png";
import linkedinlogo from "../assets/linkedinlogo.png";
import ScrollToTop from "react-scroll-to-top";

function Footer() {
  return (
    <>
      <ScrollToTop smooth top="60" width="28" />
      <footer className="footer">
        <section>
          <span>
            <img src={floppylogo} className="logo" alt="Monik" />
          </span>
          <nav>
            <a
              href="https://twitter.com/Monikanchan13"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={twitterlogo} alt="Home" className="nav-image" />
            </a>
            <a
              href="https://www.linkedin.com/in/monikanchan-chatterjee-a86862200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={linkedinlogo}
                alt="Home"
                className="nav-image"
                style={{
                  width: "25px",
                }}
              />
            </a>
            {/* <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Patreon
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              RSS
            </a> */}
          </nav>
          <nav>
            {/* <a
              href="https://www.pinjs.org"
              title="pin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>pin</span>
              <img src="" alt="pin" />
            </a> */}
            <a
              href="https://github.com/Monik2002"
              title="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>GitHub</span>
              <img src={github} alt="GitHub" />
            </a>
            {/* <a
              href="https://www.netlify.com"
              title="Netlify"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Netlify</span>
              <img src="" alt="Netlify" />
            </a> */}
          </nav>
        </section>
      </footer>
    </>
  );
}

export default Footer;
