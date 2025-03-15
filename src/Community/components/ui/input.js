import React from "react";

export const Input = ({ placeholder, value, onChange }) => {
  return <input type="text" placeholder={placeholder} value={value} onChange={onChange} />;
};
