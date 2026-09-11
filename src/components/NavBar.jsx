import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for profile dropdown (Desktop/Mobile)
  const [open, setOpen] = useState(false);
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Automatically close mobile menu when changing route paths
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-md px-4 sm:px-6 md:px-10 py-3.5 flex justify-between items-center sticky top-0 z-50 w-full select-none">
      
      {/* Brand Logo */}
      <Link
        to="/"
        className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent shrink-0"
      >
        BrainSphere
      </Link>

      {/* ========================================== */}
      {/* 🖥️ DESKTOP VIEW LAYOUT (sm: and above)    */}
      {/* ========================================== */}
      <div className="hidden md:flex gap-6 lg:gap-8 items-center">
        {user ? (
          <>
            <div className="flex gap-5 lg:gap-7 items-center">
              <NavItem to="/" label="Topics" location={location} />
              <NavItem to="/feed" label="Feed" location={location} />
              <NavItem to="/leaderboard" label="Leaderboard" location={location} />
              <NavItem to="/create" label="Create" location={location} />
              <NavItem to="/whiteboard" label="Whiteboard" location={location} />
              <NavItem to="/resources" label="Resources" location={location} />
            </div>

            {/* Profile Menu Wrapper */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-indigo-50 px-3.5 py-1.5 rounded-xl hover:bg-indigo-100/80 active:scale-95 transition"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-sm shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm text-gray-700 truncate max-w-[100px]">
                  {user.name}
                </span>
              </button>

              {/* Profile Dropdown Frame */}
              {open && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 animate-fadeIn">
                  <Link
                    to={`/profile/${user._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-slate-50 transition"
                  >
                    👤 Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold hover:bg-red-50/50 transition border-t border-slate-50 mt-1"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-4 items-center">
            <NavItem to="/login" label="Login" location={location} />
            <NavItem to="/register" label="Register" location={location} />
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 📱 MOBILE VIEW ACTIONS & BURGER BUTTON    */}
      {/* ========================================== */}
      <div className="flex md:hidden items-center gap-3">
        {/* Quick Avatar View if logged in on mobile header */}
        {user && !mobileMenuOpen && (
          <Link
            to={`/profile/${user._id}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-sm"
          >
            {user.name?.charAt(0).toUpperCase()}
          </Link>
        )}

        {/* Hamburger Toggle Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          className="p-1 text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            /* Close Icon X */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            /* Menu Icon Burger */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* ========================================== */}
      {/* 📂 MOBILE COLLAPSIBLE EXPANDED DRAWER      */}
      {/* ========================================== */}
      {mobileMenuOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-white border-b border-slate-100 shadow-xl flex flex-col md:hidden py-4 px-5 animate-slideDown z-40">
          {user ? (
            <div className="flex flex-col gap-4">
              <MobileNavItem to="/" label="📚 Topics" location={location} />
              <MobileNavItem to="/feed" label="📰 Feed" location={location} />
              <MobileNavItem to="/leaderboard" label="🏆 Leaderboard" location={location} />
              <MobileNavItem to="/create" label="✍️ Create Discussion" location={location} />
              <MobileNavItem to="/whiteboard" label="🎨 Whiteboard" location={location} />
              <MobileNavItem to="/resources" label="📁 Resources" location={location} />
              <MobileNavItem to={`/profile/${user._id}`} label="👤 My Profile" location={location} />
              
              <button
                onClick={logout}
                className="w-full text-left pt-3 mt-1 pb-1 font-bold text-red-500 border-t border-slate-100 flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <MobileNavItem to="/login" label="Login" location={location} />
              <MobileNavItem to="/register" label="Register" location={location} />
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// Desktop NavItem Component
const NavItem = ({ to, label, location }) => {
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative font-semibold text-sm transition duration-200 ${
        active ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-indigo-600 rounded-full"></span>
      )}
    </Link>
  );
};

// Mobile Drawer NavItem Component
const MobileNavItem = ({ to, label, location }) => {
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`w-full py-1 text-sm font-semibold transition ${
        active ? "text-indigo-600 pl-1" : "text-gray-600"
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;





// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useState } from "react";

// const Navbar = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [open, setOpen] = useState(false);

//   const logout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <nav className="backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-lg px-10 py-4 flex justify-between items-center sticky top-0 z-50">

//       {/* Logo */}
//       <Link
//         to="/"
//         className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
//       >
//         BrainSphere
//       </Link>

//       {/* Right Side */}
//       <div className="flex gap-8 items-center relative">

//         {user ? (
//           <>
//             <NavItem to="/" label="Topics" location={location} />
//             <NavItem to="/feed" label="Feed" location={location} />
//             <NavItem to="/leaderboard" label="Leaderboard" location={location} />
//             <NavItem to="/create" label="Create" location={location} />
//             <NavItem to="/whiteboard" label="Whiteboard" location={location} />
//             <NavItem to="/resources" label="Resources" location={location} />


//             {/* Profile Section */}
//             <div className="relative">
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center gap-3 bg-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-200 transition"
//               >
//                 <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
//                   {user.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="font-medium text-gray-700">
//                   {user.name}
//                 </span>
//               </button>

//               {/* Dropdown */}
//               {open && (
//                 <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border py-2 animate-fadeIn">

//                   <Link
//                     to={`/profile/${user._id}`}
//                     className="block px-4 py-2 hover:bg-gray-100 transition"
//                     onClick={() => setOpen(false)}
//                   >
//                     👤 Profile
//                   </Link>

//                   <button
//                     onClick={() => {
//                       logout();
//                       setOpen(false);
//                     }}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-500"
//                   >
//                     🚪 Logout
//                   </button>

//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <>
//             <NavItem to="/login" label="Login" location={location} />
//             <NavItem to="/register" label="Register" location={location} />
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// const NavItem = ({ to, label, location }) => {
//   const active = location.pathname === to;

//   return (
//     <Link
//       to={to}
//       className={`relative font-medium transition ${
//         active ? "text-indigo-600" : "text-gray-700"
//       } hover:text-indigo-600`}
//     >
//       {label}

//       {active && (
//         <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-indigo-600 rounded-full"></span>
//       )}
//     </Link>
//   );
// };

// export default Navbar;
