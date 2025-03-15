import React from "react";
import SearchBar from "./SearchBar";
import "./styles/Header.css";
const Header = () => {
  return (
    <div className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-lg font-bold">Book Club Network</h1>
      <SearchBar />
    </div>
  );
};

export default Header;
