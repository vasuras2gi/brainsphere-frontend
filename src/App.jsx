import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import CreateDebate from "./pages/CreateDebate";
import DebateDetail from "./pages/DebateDetail";
import Whiteboard from "./pages/Whiteboard";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Feed from "./pages/Feed";

function App() {
  // Safe token extraction logic configuration initialized
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <BrowserRouter>
      {/* Fixed: Layout wraps safely avoiding layout bleeding issues across viewports */}
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col antialiased">
        
        {/* Global Navigation Header Component */}
        <Navbar />

        {/* 
          Fixed: Added a responsive top padding container layer (`pt-16 sm:pt-20`).
          This ensures that headers and content across nested pages like Feed, Whiteboard, or Dashboard 
          never get clipped or overlapped behind the sticky/fixed layout header height.
        */}
        <main className="flex-1 w-full pt-16 sm:pt-20 flex flex-col justify-start">
          <Routes>

            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ---------- PROTECTED ROUTES ---------- */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateDebate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />

            <Route
              path="/debate/:id"
              element={
                <ProtectedRoute>
                  <DebateDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/whiteboard"
              element={
                <ProtectedRoute>
                  <Whiteboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />

            {/* ---------- 404 FALLBACK ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;




// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import Leaderboard from "./pages/Leaderboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/NavBar";
// import CreateDebate from "./pages/CreateDebate";
// import DebateDetail from "./pages/DebateDetail";
// import Whiteboard from "./pages/Whiteboard";
// import Profile from "./pages/Profile";
// import Resources from "./pages/Resources";
// import Feed from "./pages/Feed";

// function App() {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
//         <Navbar />

//         <Routes>

//           {/* ---------- PUBLIC ROUTES ---------- */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* ---------- PROTECTED ROUTES ---------- */}

//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/profile/:id"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/leaderboard"
//             element={
//               <ProtectedRoute>
//                 <Leaderboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/create"
//             element={
//               <ProtectedRoute>
//                 <CreateDebate />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/feed"
//             element={
//               <ProtectedRoute>
//                 <Feed />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/debate/:id"
//             element={
//               <ProtectedRoute>
//                 <DebateDetail />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/whiteboard"
//             element={
//               <ProtectedRoute>
//                 <Whiteboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/resources"
//             element={
//               <ProtectedRoute>
//                 <Resources />
//               </ProtectedRoute>
//             }
//           />

//           {/* ---------- 404 FALLBACK ---------- */}
//           <Route path="*" element={<Navigate to="/" />} />

//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
