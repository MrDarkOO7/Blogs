import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "../styles/navbar.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          MyBlogSite
        </Link>
      </div>

      <div className="navbar-right">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Blogs
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink
              to="/my-blogs"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              My Blogs
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Create
            </NavLink>
            <span className="nav-user">Hello, {user?.name}</span>
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="nav-login">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
