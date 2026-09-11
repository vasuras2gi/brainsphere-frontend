import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-lg px-10 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        BrainSphere
      </Link>

      {/* Right Side */}
      <div className="flex gap-8 items-center relative">

        {user ? (
          <>
            <NavItem to="/" label="Topics" location={location} />
            <NavItem to="/feed" label="Feed" location={location} />
            <NavItem to="/leaderboard" label="Leaderboard" location={location} />
            <NavItem to="/create" label="Create" location={location} />
            <NavItem to="/whiteboard" label="Whiteboard" location={location} />
            <NavItem to="/resources" label="Resources" location={location} />


            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 bg-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-200 transition"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">
                  {user.name}
                </span>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border py-2 animate-fadeIn">

                  <Link
                    to={`/profile/${user._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    👤 Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-500"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavItem to="/login" label="Login" location={location} />
            <NavItem to="/register" label="Register" location={location} />
          </>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ to, label, location }) => {
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative font-medium transition ${
        active ? "text-indigo-600" : "text-gray-700"
      } hover:text-indigo-600`}
    >
      {label}

      {active && (
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-indigo-600 rounded-full"></span>
      )}
    </Link>
  );
};

export default Navbar;
