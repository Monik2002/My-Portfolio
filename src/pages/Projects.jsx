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

import { useState, useEffect, useRef } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import StarIcon from "../components/StarIcon";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const tourRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/Monik2002/repos"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        // Filter out forks
        const filteredProjects = data.filter(
          (project) => !project.fork && project.name !== "Monik2002"
        );
        // Sort projects by stargazers count
        filteredProjects.sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        );

        const projectsWithDemoLink = filteredProjects.map((project) => {
          const hasHttp =
            project.description && project?.website?.includes("http");
          const hasHttps =
            project.description && project?.website?.includes("https");
          const demoLink = hasHttp || hasHttps;
          return {
            ...project,
            demoLink,
          };
        });

        if (isMounted) {
          localStorage.setItem(
            "projects",
            JSON.stringify(projectsWithDemoLink)
          );
          setProjects(projectsWithDemoLink);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Uh oh! Something went wrong.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
      setIsLoading(false); // Set loading to false if data is in localStorage
    } else {
      fetchProjects();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (tourRef.current) return;

    const tour = new Shepherd.Tour({
      defaults: {
        classes: "shepherd-theme-arrows",
        scrollTo: true,
      },
    });

    tour.addStep({
      id: "step-1",
      text: "This is the projects page.",
      attachTo: {
        element: ".hero h1",
        on: "bottom",
      },
      buttons: [
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      id: "step-2",
      text: "Here you can see a list of projects.",
      attachTo: {
        element: ".project-preview",
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      id: "step-3",
      text: "Use these buttons to navigate through the project pages.",
      attachTo: {
        element: ".flex.justify-between",
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
        },
        {
          text: "Done",
          action: tour.complete,
        },
      ],
    });

    tour.start();
    tourRef.current = tour;
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader
          color={"#123abc"}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
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
                  <div className="stars">
                    <div className="star">
                      <a
                        href={project.html_url + "/stargazers"}
                        target="_blank"
                      >
                        {project.stargazers_count}
                      </a>
                      <StarIcon />
                    </div>
                  </div>
                  <div>
                    <time>
                      {new Date(project.created_at).getFullYear().toString()}
                    </time>
                    <a
                      className="card-header"
                      href={project.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.name}
                    </a>
                    <p>{project.description}</p>
                  </div>
                  <div className="links anchored">
                    <a
                      className="button small flex"
                      href={project.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                    {project.demoLink && (
                      <a
                        className="button small flex"
                        href={project.demoLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                  currentPage === Math.ceil(projects.length / projectsPerPage)
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
