import React from "react";
import Header from "../../shared/layouts/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../shared/layouts/footer/Footer";
import Nav from "../../shared/layouts/nav/Nav";

function DefaultLayout() {
  return (
    <>
      <Header />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default DefaultLayout;
