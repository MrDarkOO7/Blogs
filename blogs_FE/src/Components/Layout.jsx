import { Outlet } from "react-router-dom";
import "../styles/layout.css";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
