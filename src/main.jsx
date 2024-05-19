// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Projects from "./pages/Projects";
// import Contact from "./pages/Contact";
// import Footer from "./components/Footer";
// import Navigation from "./components/Navigation";
// import App from "./App";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "/",
//         element: (
//           <>
//             <Navigation />
//             <Home />
//             <Footer />
//           </>
//         ),
//       },
//       {
//         path: "/me",
//         element: (
//           <>
//             <Navigation />
//             <About />
//             <Footer />
//           </>
//         ),
//       },
//       {
//         path: "/projects",
//         element: (
//           <>
//             <Navigation />
//             <Projects />
//             <Footer />
//           </>
//         ),
//       },
//       {
//         path: "/contact",
//         element: (
//           <>
//             <Navigation />
//             <Contact />
//             <Footer />
//           </>
//         ),
//       },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//     {/* <App /> */}
//   </React.StrictMode>
// );

import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ClipLoader } from "react-spinners";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <ClipLoader
                  color={"#123abc"}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            }
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/me",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <ClipLoader
                  color={"#123abc"}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            }
          >
            <About />
          </Suspense>
        ),
      },
      {
        path: "/projects",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <ClipLoader
                  color={"#123abc"}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            }
          >
            <Projects />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <ClipLoader
                  color={"#123abc"}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            }
          >
            <Contact />
          </Suspense>
        ),
      },
    ],
  },
]);

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
