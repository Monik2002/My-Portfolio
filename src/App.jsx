// import { useState, useEffect, useRef } from "react";
// import gsap from "gsap";
// import "./App.css";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Projects from "./pages/Projects";
// import Contact from "./pages/Contact";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Footer from "./components/Footer";
// import Navigation from "./components/Navigation";

// const App = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const comp = useRef(null);

//   useEffect(() => {
//     if (comp.current) {
//       const t1 = gsap.timeline();
//       t1.from("#welcome", { opacity: 1, duration: 0.3 }).to(
//         "#welcome",
//         {
//           opacity: 0,
//           y: "-100vh",
//           duration: 0.3,
//           delay: 0.5,
//           onComplete: () => setShowWelcome(false), // Set showWelcome to false after animation completes
//         },
//         "+=0.3"
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (!showWelcome && comp.current) {
//       // Hide the welcome section after animation is complete
//       comp.current.style.display = "none";
//     }
//   }, [showWelcome]);

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: (
//         <>
//           <Navigation />
//           <Home />
//           <Footer />
//         </>
//       ),
//     },
//     {
//       path: "/me",
//       element: (
//         <>
//           <Navigation />
//           <About />
//           <Footer />
//         </>
//       ),
//     },
//     {
//       path: "/projects",
//       element: (
//         <>
//           <Navigation />
//           <Projects />
//           <Footer />
//         </>
//       ),
//     },
//     {
//       path: "/contact",
//       element: (
//         <>
//           <Navigation />
//           <Contact />
//           <Footer />
//         </>
//       ),
//     },
//   ]);

//   return (
//     <>
//       {showWelcome && (
//         // Show welcome section if showWelcome is true
//         <div className="relative" ref={comp}>
//           <div className="h-screen flex bg-gray-950 justify-center place-items-center">
//             <h1
//               id="welcome"
//               className="text-9xl font-bold text-gray-100 font-spaceGrotesk"
//             >
//               Welcome.
//             </h1>
//           </div>
//         </div>
//       )}
//       <div style={{ display: showWelcome ? "none" : "block" }}>
//         <div id="layout" className="layout">
//           <RouterProvider router={router} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default App;

// import { useState, useEffect, useRef } from "react";
// import "./App.css";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Projects from "./pages/Projects";
// import Contact from "./pages/Contact";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Footer from "./components/Footer";
// import Navigation from "./components/Navigation";
// import gsap from "gsap";
// import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "./components/ThemeContext";

// const App = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const comp = useRef(null);

//   useEffect(() => {
//     if (comp.current) {
//       const t1 = gsap.timeline();
//       t1.from(comp.current, { opacity: 1, duration: 0.2 }).to(
//         comp.current,
//         {
//           onComplete: () => setShowWelcome(false),
//           y: "-100vh",
//           duration: 0.3,
//           delay: 0.3,
//         },
//         "-=0.3"
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (!showWelcome && comp.current) {
//       comp.current.style.display = "none";
//     }
//   }, [showWelcome]);

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: (
//         <>
//           <Navigation />
//           <Home />
//           <Footer />
//         </>
//       ),
//     },
//     {
//       path: "/me",
//       element: (
//         <>
//           <Navigation />
//           <About />
//           <Footer />
//         </>
//       ),
//     },
//     {
//       path: "/projects",
//       element: (
//         <>
//           <Navigation />
//           <Projects />
//           <Footer />
//         </>
//       ),
//     },
//     {
//       path: "/contact",
//       element: (
//         <>
//           <Navigation />
//           <Contact />
//           <Footer />
//         </>
//       ),
//     },
//   ]);

//   return (
//     <>
//       <ThemeProvider>
//         {showWelcome && (
//           <div
//             className="relative"
//             style={{
//               height: "100vh",
//               overflow: "hidden",
//               position: "relative",
//             }}
//           >
//             <div
//               className="h-screen flex bg-gray-950 justify-center place-items-center"
//               ref={comp}
//             >
//               <h1
//                 id="welcome"
//                 className="text-9xl font-bold text-gray-100 font-spaceGrotesk"
//                 style={{ position: "absolute" }}
//               >
//                 Welcome.
//               </h1>
//             </div>
//           </div>
//         )}
//         <div style={{ display: showWelcome ? "none" : "block" }}>
//           <div id="layout" className="layout">
//             <RouterProvider router={router} />
//           </div>
//         </div>
//         <Toaster position="top-center" />
//       </ThemeProvider>
//     </>
//   );
// };

// export default App;

// import { useState, useEffect, useRef } from "react";
// import "./App.css";
// // import Home from "./pages/Home";
// // import About from "./pages/About";
// // import Projects from "./pages/Projects";
// // import Contact from "./pages/Contact";
// // import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
// // import Footer from "./components/Footer";
// // import Navigation from "./components/Navigation";
// import gsap from "gsap";
// import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "./components/ThemeContext";
// import { Outlet } from "react-router-dom";

// const App = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const comp = useRef(null);

//   useEffect(() => {
//     if (comp.current) {
//       const t1 = gsap.timeline();
//       t1.from(comp.current, { opacity: 1, duration: 0.2 }).to(
//         comp.current,
//         {
//           onComplete: () => setShowWelcome(false),
//           y: "-100vh",
//           duration: 0.3,
//           delay: 0.3,
//         },
//         "-=0.3"
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (!showWelcome && comp.current) {
//       comp.current.style.display = "none";
//     }
//   }, [showWelcome]);

//   // const router = createBrowserRouter([
//   //   {
//   //     path: "/",
//   //     element: (
//   //       <>
//   //         <Navigation />
//   //         <Home />
//   //         <Footer />
//   //       </>
//   //     ),
//   //   },
//   //   {
//   //     path: "/me",
//   //     element: (
//   //       <>
//   //         <Navigation />
//   //         <About />
//   //         <Footer />
//   //       </>
//   //     ),
//   //   },
//   //   {
//   //     path: "/projects",
//   //     element: (
//   //       <>
//   //         <Navigation />
//   //         <Projects />
//   //         <Footer />
//   //       </>
//   //     ),
//   //   },
//   //   {
//   //     path: "/contact",
//   //     element: (
//   //       <>
//   //         <Navigation />
//   //         <Contact />
//   //         <Footer />
//   //       </>
//   //     ),
//   //   },
//   // ]);

//   return (
//     <>
//       <ThemeProvider>
//         {showWelcome && (
//           <div
//             className="relative"
//             style={{
//               height: "100vh",
//               overflow: "hidden",
//               position: "relative",
//             }}
//           >
//             <div
//               className="h-screen flex bg-gray-950 justify-center place-items-center"
//               ref={comp}
//             >
//               <h1
//                 id="welcome"
//                 className="text-9xl font-bold text-gray-100 font-spaceGrotesk"
//                 style={{ position: "absolute" }}
//               >
//                 Welcome.
//               </h1>
//             </div>
//           </div>
//         )}
//         <div style={{ display: showWelcome ? "none" : "block" }}>
//           <div id="layout" className="layout">
//             {/* <RouterProvider router={router} /> */}
//             <Outlet />
//           </div>
//         </div>
//         <Toaster position="top-center" />
//       </ThemeProvider>
//     </>
//   );
// };

// export default App;

// import { useState, useEffect, useRef } from "react";
// import { Outlet } from "react-router-dom";
// import "./App.css";
// import { ThemeProvider } from "./components/ThemeContext";
// import { Toaster } from "react-hot-toast";
// import gsap from "gsap";
// import Navigation from "./components/Navigation";
// import Footer from "./components/Footer";

// const App = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const comp = useRef(null);

//   useEffect(() => {
//     if (comp.current) {
//       const t1 = gsap.timeline();
//       t1.from(comp.current, { opacity: 1, duration: 0.2 }).to(
//         comp.current,
//         {
//           onComplete: () => setShowWelcome(false),
//           y: "-100vh",
//           duration: 0.3,
//           delay: 0.3,
//         },
//         "-=0.3"
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (!showWelcome && comp.current) {
//       comp.current.style.display = "none";
//     }
//   }, [showWelcome]);

//   return (
//     <>
//       <ThemeProvider>
//         {showWelcome && (
//           <div
//             className="relative"
//             style={{
//               height: "100vh",
//               overflow: "hidden",
//               position: "relative",
//             }}
//           >
//             <div
//               className="h-screen flex bg-gray-950 justify-center place-items-center"
//               ref={comp}
//             >
//               <h1
//                 id="welcome"
//                 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-100 font-spaceGrotesk"
//                 style={{ position: "absolute" }}
//               >
//                 Welcome.
//               </h1>
//             </div>
//           </div>
//         )}
//         <div style={{ display: showWelcome ? "none" : "block" }}>
//           <Navigation />
//           <div id="layout" className="layout">
//             <Outlet />
//           </div>
//           <Footer />
//         </div>
//         <Toaster position="top-center" />
//       </ThemeProvider>
//     </>
//   );
// };

// export default App;

import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeContext";
import { Toaster } from "react-hot-toast";
import gsap from "gsap";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const comp = useRef(null);

  useEffect(() => {
    if (comp.current) {
      const t1 = gsap.timeline();
      t1.from(comp.current, { opacity: 1, duration: 0.2 }).to(
        comp.current,
        {
          onComplete: () => setShowWelcome(false),
          y: "-100vh",
          duration: 0.3,
          delay: 0.3,
        },
        "-=0.3"
      );
    }
  }, []);

  useEffect(() => {
    if (!showWelcome && comp.current) {
      comp.current.style.display = "none";
    }
  }, [showWelcome]);

  // Initialize Shepherd tour
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
      id: "welcome-step",
      text: "Welcome to my portfolio! This tour will guide you through the main features.",
      attachTo: { element: "#welcome", on: "bottom" },
      buttons: [
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      id: "navigation-step",
      text: "Here is the navigation bar to help you navigate through different sections.",
      attachTo: { element: ".navigation", on: "bottom" },
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

    // More steps can be added similarly...

    tour.start();

    return () => {
      tour.complete();
    };
  }, []);

  return (
    <>
      <ThemeProvider>
        {showWelcome && (
          <div
            className="relative"
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              className="h-screen flex bg-gray-950 justify-center place-items-center"
              ref={comp}
            >
              <h1
                id="welcome"
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-100 font-spaceGrotesk"
                style={{ position: "absolute" }}
              >
                Welcome.
              </h1>
            </div>
          </div>
        )}
        <div style={{ display: showWelcome ? "none" : "block" }}>
          <Navigation className="navigation" />
          <div id="layout" className="layout">
            <Outlet />
          </div>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </ThemeProvider>
    </>
  );
};

export default App;
