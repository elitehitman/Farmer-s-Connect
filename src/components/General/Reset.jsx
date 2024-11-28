import React from "react";
import { useEffect } from "react";
const Reset = () => {
  useEffect(() => {
    // Clear only the form data from localStorage, not everything
    localStorage.clear();
  }, []);
  return <div></div>;
};

export default Reset;
