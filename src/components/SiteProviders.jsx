"use client";

import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import { ThemeProvider } from "./ThemeContext";

export default function SiteProviders({ children }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

SiteProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
