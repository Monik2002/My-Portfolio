import Link from "next/link";
import Proptypes from "prop-types";

const ProjectPreview = ({ title, description, source, demoLink }) => {
  return (
    <div className="anchored card">
      <div>
        <a
          className="card-header"
          href={source}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
        <p>{description}</p>
      </div>
      <div className="anchored links">
        <a
          className="button"
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source code for ${title}`}
        >
          Source
        </a>
        {demoLink && (
          <a
            className="button flex"
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Live demo of ${title}`}
          >
            Demo
          </a>
        )}
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section className="segment large">
      <div className="home-heading">
        <h2 className="title">Projects</h2>
        <Link className="button" href="/projects">
          View all
        </Link>
      </div>
      <div className="post-preview">
        <ProjectPreview
          title="Binge Box"
          description="Provides you with a curated collection of top-rated movies and TV shows!"
          source="https://github.com/Monik2002/Binge-box-Project"
          demoLink="https://main--bingeboxx.netlify.app/"
        />
        <ProjectPreview
          title="Shopping List"
          description="Vanilla JS shopping list"
          source="https://github.com/Monik2002/Shopping-list-JS"
          demoLink="https://shopping-list-js-1.netlify.app/"
        />
        <ProjectPreview
          title="Trippify Travel App"
          description="A travel-planning app."
          source="https://github.com/Monik2002/Trippify-Travel-App"
        />
      </div>
    </section>
  );
};

ProjectPreview.propTypes = {
  title: Proptypes.string.isRequired,
  description: Proptypes.string.isRequired,
  source: Proptypes.string.isRequired,
  demoLink: Proptypes.string,
};

export default ProjectsSection;
