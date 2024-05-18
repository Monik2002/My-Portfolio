// import React from "react";
import { NavLink } from "react-router-dom";
import Proptypes from "prop-types";

const ProjectPreview = ({ year, title, description, source, demoLink }) => {
  return (
    <div className="anchored card">
      <div>
        <time>{year}</time>
        <a
          className="card-header"
          href={source}
          target="_blank"
          rel="noreferrer"
        >
          {title}
        </a>
        <p>{description}</p>
      </div>
      <div className="anchored links">
        <a className="button" href={source}>
          Source
        </a>
        <a
          className="button flex"
          href={demoLink}
          target="_blank"
          rel="noreferrer"
        >
          Demo
        </a>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section className="segment large">
      <h2 className="home-heading">
        <div>
          <div className="title">Projects</div>
        </div>
        <NavLink className="button" to="/projects">
          View all
        </NavLink>
      </h2>
      <div className="post-preview">
        <ProjectPreview
          year="2023"
          title="Binge-box-Project"
          description="Provides you with a curated collection of top-rated movies and TV shows!"
          source="https://github.com/Monik2002/Binge-box-Project"
          demoLink="main--bingeboxx.netlify.app/"
        />
        <ProjectPreview
          year="2023"
          title="Vanilla JS shopping list"
          description="This web application allows you to create and manage your shopping list online."
          source="https://github.com/taniarascia/takenote"
          demoLink="https://shopping-list-js-1.netlify.app/"
        />
        <ProjectPreview
          year="2023"
          title="Web Music Player"
          description="This is a web-based music player that allows you to play, pause, play the next track, play the previous track, and even start playing from a specific point in the song."
          source="https://github.com/taniarascia/chip8"
          demoLink="https://music-player321.netlify.app/"
        />
      </div>
    </section>
  );
};

ProjectPreview.propTypes = {
  year: Proptypes.string.isRequired,
  title: Proptypes.string.isRequired,
  description: Proptypes.string.isRequired,
  source: Proptypes.string.isRequired,
  demoLink: Proptypes.string.isRequired,
};

export default ProjectsSection;
