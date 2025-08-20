import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "calc(100vh - 120px)" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
