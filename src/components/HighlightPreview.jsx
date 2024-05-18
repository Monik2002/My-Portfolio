// // import React from "react";
// import PropTypes from "prop-types";

// function HighlightPreview({ date, title, imageUrl, link }) {
//   return (
//     <div className="muted card flex">
//       <div
//         className="pin-image-wrapper"
//         style={{
//           position: "relative",
//           overflow: "hidden",
//           display: "inline-block",
//           width: "45px",
//           height: "45px",
//         }}
//       >
//         <img
//           aria-hidden="true"
//           src={imageUrl}
//           alt="image"
//           style={{
//             position: "absolute",
//             top: "0px",
//             left: "0px",
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             objectPosition: "center center",
//             opacity: "0",
//             transitionDelay: "500ms",
//           }}
//         />
//         <picture>
//           <source srcSet={`${imageUrl} 1x, ${imageUrl} 1.5x, ${imageUrl} 2x`} />
//           <img
//             srcSet={`${imageUrl} 1x, ${imageUrl} 1.5x, ${imageUrl} 2x`}
//             src={imageUrl}
//             alt=""
//             width="45"
//             height="45"
//             loading="lazy"
//             style={{
//               position: "absolute",
//               top: "0px",
//               left: "0px",
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               objectPosition: "center center",
//               opacity: "1",
//               transition: "opacity 500ms ease 0s",
//             }}
//           />
//         </picture>
//       </div>
//       <div>
//         <time>{date}</time>
//         <a className="card-header" href={link}>
//           {title}
//         </a>
//       </div>
//     </div>
//   );
// }

// HighlightPreview.propTypes = {
//   date: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   imageUrl: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
// };

// export default HighlightPreview;

// import React from "react";
import PropTypes from "prop-types";

const HighlightPreview = ({
  date,
  title,
  imageUrl,
  // link,
}) => {
  return (
    <div className="muted card flex">
      <div
        className="pin-image-wrapper"
        style={{
          position: "relative",
          overflow: "hidden",
          display: "inline-block",
          width: "45px",
          height: "45px",
        }}
      >
        <img
          aria-hidden="true"
          src={imageUrl["1x"]}
          alt="image"
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            opacity: "0",
            transitionDelay: "500ms",
          }}
        />
        <picture>
          <source
            srcSet={`${imageUrl["1x"]} 1x, ${imageUrl["1.5x"]} 1.5x, ${imageUrl["2x"]} 2x`}
          />
          <img
            src={imageUrl["1x"]}
            alt=""
            width="45"
            height="45"
            loading="lazy"
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              opacity: "1",
              transition: "opacity 500ms ease 0s",
            }}
          />
        </picture>
      </div>
      <div>
        <time>{date}</time>
        <a className="card-header">{title}</a>
      </div>
    </div>
  );
};

HighlightPreview.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.shape({
    "1x": PropTypes.string.isRequired,
    "1.5x": PropTypes.string.isRequired,
    "2x": PropTypes.string.isRequired,
  }).isRequired,
  // link: PropTypes.string.isRequired,
};

export default HighlightPreview;
