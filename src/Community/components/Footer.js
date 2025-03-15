import React from "react";
import "./styles/Footer.css"; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Book Club Network. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
