// import React from "react";
import HighlightPreview from "./HighlightPreview";
import cssImage1x from "../assets/cssImage1x.png";
import cssImage1_5x from "../assets/cssImage1_5x.png";
import cssImage2x from "../assets/cssImage2x.png";
import jsImage1x from "../assets/jsImage1x.png";
import jsImage1_5x from "../assets/jsImage1_5x.png";
import jsImage2x from "../assets/jsImage2x.png";
import reactImage1x from "../assets/reactImage1x.png";
import reactImage1_5x from "../assets/reactImage1_5x.png";
import reactImage2x from "../assets/reactImage2x.png";

const HighlightSection = () => {
  const highlights = [
    {
      date: "September 9, 2022",
      title: "Understanding CSS",
      imageUrl: {
        "1x": cssImage1x,
        "1.5x": cssImage1_5x,
        "2x": cssImage2x,
      },
      // link: "/design-for-developers/",
    },
    {
      date: "October 12, 2022",
      title: "Understanding JavaScript",
      imageUrl: {
        "1x": jsImage1x,
        "1.5x": jsImage1_5x,
        "2x": jsImage2x,
      },
      // link: "/design-for-developers/",
    },
    {
      date: "December 13, 2022",
      title: "Understanding React Props",
      imageUrl: {
        "1x": reactImage1x,
        "1.5x": reactImage1_5x,
        "2x": reactImage2x,
      },
      // link: "/design-for-developers/",
    },
    {
      date: "January 1, 2023",
      title: "Understanding React Hooks",
      imageUrl: {
        "1x": reactImage1x,
        "1.5x": reactImage1_5x,
        "2x": reactImage2x,
      },
      // link: "/design-for-developers/",
    },
  ];

  return (
    // <div className="container">
    <section className="segment large">
      <h2 className="home-heading">
        <div>
          <div className="title">Highlights</div>
        </div>
      </h2>
      <div className="highlight-preview">
        {highlights.map((highlight, index) => (
          <HighlightPreview
            key={index}
            date={highlight.date}
            title={highlight.title}
            imageUrl={highlight.imageUrl}
            // link={highlight.link}
          />
        ))}
      </div>
    </section>
    // </div>
  );
}

export default HighlightSection;
