import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./components/Home/Home";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import Profile from "./components/Profile/Profile";
import FarmerNetwork from "./components/FarmerNetwork/FarmerNetwork";
import Contract from "./components/Contract/Contract";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Home />
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          <Signup />
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <Profile />
        </>
      ),
    },
    {
      path: "/farmer-network",
      element: (
        <>
          <FarmerNetwork />
        </>
      ),
    },
    {
      path: "/contract",
      element: (
        <>
          <Contract />
        </>
      ),
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
