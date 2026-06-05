import React from "react";
import Header from "../../shared/layouts/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../shared/layouts/footer/Footer";

function DefaultLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default DefaultLayout;
