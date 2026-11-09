"use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import ClipLoader from "react-spinners/ClipLoader";
// import StarIcon from "../components/StarIcon";

// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch(
//           "https://api.github.com/users/Monik2002/repos"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch projects");
//         }
//         const data = await response.json();
//         // Filter out forks
//         const filteredProjects = data.filter(
//           (project) => !project.fork && project.name !== "Monik2002"
//         );
//         // Sort projects by stargazers count
//         filteredProjects.sort(
//           (a, b) => b.stargazers_count - a.stargazers_count
//         );

//         const projectsWithDemoLink = filteredProjects.map((project) => {
//           const demoLinkMatch =
//             project.description && project.website.match(/\bhttps?:\/\/\S+/);
//           const demoLink = demoLinkMatch ? demoLinkMatch[0] : null;
//           return {
//             ...project,
//             demoLink,
//           };
//         });

//         localStorage.setItem("projects", JSON.stringify(projectsWithDemoLink));
//         setProjects(projectsWithDemoLink);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         toast.error("Uh oh! Something went wrong.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const savedProjects = localStorage.getItem("projects");
//     if (savedProjects) {
//       setProjects(JSON.parse(savedProjects));
//       setIsLoading(false); // Set loading to false if data is in localStorage
//     } else {
//       fetchProjects();
//     }
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <ClipLoader
//           color={"#123abc"}
//           size={150}
//           aria-label="Loading Spinner"
//           data-testid="loader"
//         />
//       </div>
//     );
//   }

//   return (
//     <main>
//       <div>
//         <div className="container">
//           <header className="hero">
//             <h1>Projects</h1>
//           </header>
//         </div>
//         <section className="segment">
//           <div className="container">
//             <div className="project-preview">
//               {projects.map((project) => (
//                 <div key={project.id} className="card anchored large">
//                   <div className="stars">
//                     <div className="star">
//                       <a href={project.html_url + "/stargazers"}>
//                         {project.stargazers_count}
//                       </a>
//                       <StarIcon />
//                     </div>
//                   </div>
//                   <div>
//                     <time>
//                       {new Date(project.created_at).getFullYear().toString()}
//                     </time>
//                     <a
//                       className="card-header"
//                       href={project.html_url}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       {project.name}
//                     </a>
//                     <p>{project.description}</p>
//                   </div>
//                   <div className="links anchored">
//                     <a
//                       className="button small flex"
//                       href={project.html_url}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       Source
//                     </a>
//                     {project.demoLink && (
//                       <a
//                         className="button small flex"
//                         href={project.demoLink}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Demo
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default Projects;

//---------------------------

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import ClipLoader from "react-spinners/ClipLoader";
// import StarIcon from "../components/StarIcon";

// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const projectsPerPage = 4;

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProjects = async () => {
//       try {
//         const response = await fetch(
//           "https://api.github.com/users/Monik2002/repos"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch projects");
//         }
//         const data = await response.json();
//         // Filter out forks
//         const filteredProjects = data.filter(
//           (project) => !project.fork && project.name !== "Monik2002"
//         );
//         // Sort projects by stargazers count
//         filteredProjects.sort(
//           (a, b) => b.stargazers_count - a.stargazers_count
//         );

//         const projectsWithDemoLink = filteredProjects.map((project) => {
//           const hasHttp =
//             project.description && project?.website?.includes("http");
//           const hasHttps =
//             project.description && project?.website?.includes("https");
//           const demoLink = hasHttp || hasHttps;
//           return {
//             ...project,
//             demoLink,
//           };
//         });

//         if (isMounted) {
//           localStorage.setItem(
//             "projects",
//             JSON.stringify(projectsWithDemoLink)
//           );
//           setProjects(projectsWithDemoLink);
//         }
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         toast.error("Uh oh! Something went wrong.");
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     const savedProjects = localStorage.getItem("projects");
//     if (savedProjects) {
//       setProjects(JSON.parse(savedProjects));
//       setIsLoading(false); // Set loading to false if data is in localStorage
//     } else {
//       fetchProjects();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Get current projects for the page
//   const indexOfLastProject = currentPage * projectsPerPage;
//   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
//   const currentProjects = projects.slice(
//     indexOfFirstProject,
//     indexOfLastProject
//   );

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(projects.length / projectsPerPage)) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <ClipLoader
//           color={"#123abc"}
//           size={150}
//           aria-label="Loading Spinner"
//           data-testid="loader"
//         />
//       </div>
//     );
//   }

//   return (
//     <main>
//       <div>
//         <div className="container">
//           <header className="hero">
//             <h1>Projects</h1>
//           </header>
//         </div>
//         <section className="segment">
//           <div className="container">
//             <div className="project-preview">
//               {currentProjects.map((project) => (
//                 <div key={project.id} className="card anchored large">
//                   <div className="stars">
//                     <div className="star">
//                       <a
//                         href={project.html_url + "/stargazers"}
//                         target="_blank"
//                       >
//                         {project.stargazers_count}
//                       </a>
//                       <StarIcon />
//                     </div>
//                   </div>
//                   <div>
//                     <time>
//                       {new Date(project.created_at).getFullYear().toString()}
//                     </time>
//                     <a
//                       className="card-header"
//                       href={project.html_url}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       {project.name}
//                     </a>
//                     <p>{project.description}</p>
//                   </div>
//                   <div className="links anchored">
//                     <a
//                       className="button small flex"
//                       href={project.html_url}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       Source
//                     </a>
//                     {project.demoLink && (
//                       <a
//                         className="button small flex"
//                         href={project.demoLink}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Demo
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between mt-4">
//               <button
//                 className="button small flex"
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//               >
//                 &larr; Previous
//               </button>
//               <button
//                 className="button small flex"
//                 onClick={handleNextPage}
//                 disabled={
//                   currentPage === Math.ceil(projects.length / projectsPerPage)
//                 }
//               >
//                 Next &rarr;
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default Projects;

// -------------------

import { useState, useEffect } from "react";
import StarIcon from "../components/StarIcon";
import {
  getProjectsForDisplay,
  normalizeGitHubProjects,
} from "../lib/github-projects";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectLoadMessage, setProjectLoadMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const projectsPerPage = 4;
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`GitHub returned HTTP ${response.status}.`);
        }
        const projectsWithDemoLink = normalizeGitHubProjects(
          await response.json()
        );
        projectsWithDemoLink.sort(
          (first, second) => second.stargazers_count - first.stargazers_count
        );

        if (isMounted) {
          setCurrentPage(1);
          setProjects(getProjectsForDisplay(projectsWithDemoLink));
          setProjectLoadMessage(
            projectsWithDemoLink.length > 0
              ? ""
              : "GitHub returned no displayable projects. Showing featured projects instead."
          );
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setCurrentPage(1);
          setProjects(getProjectsForDisplay([]));
          setProjectLoadMessage(
            error.message === "GitHub returned HTTP 403."
              ? "GitHub's public API rate limit is temporarily exhausted (HTTP 403). Showing featured projects instead."
              : "The live GitHub project list is temporarily unavailable. Showing featured projects instead."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  // Get current projects for the page
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(projects.length / projectsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <main>
        <div>
          <div className="container">
            <header className="hero">
              <h1>Projects</h1>
            </header>
          </div>
          <div
            className="flex h-screen items-center justify-center"
            role="status"
            aria-label="Loading projects"
          >
            <div className="loading-spinner" aria-hidden="true" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div>
        <div className="container">
          <header className="hero">
            <h1>Projects</h1>
          </header>
        </div>
        <section className="segment">
          <div className="container">
            <div className="project-preview">
              {currentProjects.map((project) => (
                <div key={project.id} className="card anchored large">
                  {project.stargazers_count !== null && (
                    <div className="stars">
                      <div className="star">
                        <a
                          href={project.html_url + "/stargazers"}
                          aria-label={`${project.stargazers_count} stars for ${project.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.stargazers_count}
                        </a>
                        <StarIcon />
                      </div>
                    </div>
                  )}
                  <div>
                    {project.created_at && (
                      <time>
                        {new Date(project.created_at).getFullYear().toString()}
                      </time>
                    )}
                    <a
                      className="card-header"
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.name}
                    </a>
                    <p>{project.description}</p>
                    {project.language && (
                      <span className="project-language">{project.language}</span>
                    )}
                  </div>
                  <div className="links anchored">
                    <a
                      className="button small flex"
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Source code for ${project.name}`}
                    >
                      Source
                    </a>
                    {project.demoLink && (
                      <a
                        className="button small flex"
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Live demo of ${project.name}`}
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {projectLoadMessage && (
              <div className="card single mt-4" role="status">
                <p>{projectLoadMessage}</p>
                <div className="links">
                  <a
                    className="button small"
                    href="https://github.com/Monik2002?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Browse GitHub
                  </a>
                  <button
                    className="button small"
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setIsLoading(true);
                      setRetryCount((count) => count + 1);
                    }}
                  >
                    {isLoading ? "Retrying..." : "Retry"}
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <button
                className="button small flex"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                &larr; Previous
              </button>
              <button
                className="button small flex"
                onClick={handleNextPage}
                disabled={
                  currentPage ===
                  Math.ceil(projects.length / projectsPerPage)
                }
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Projects;
