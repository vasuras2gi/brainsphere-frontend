import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const Dashboard = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔥 Fetch Debates
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const { data } = await api.get("/debates");
        setDebates(data);
      } catch (error) {
        console.error("Error fetching debates", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebates();
  }, []);

  // 🔥 Stable GSAP Animation
  useEffect(() => {
    if (loading || debates.length === 0) return;

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.fromTo(
        ".page-title",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Cards Animation
      gsap.fromTo(
        ".debate-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, debates]);

  // 🔥 Like Animation
  const handleVote = async (id, e) => {
    try {
      const { data } = await api.post(`/debates/${id}/vote`);

      // Button pop animation
      gsap.fromTo(
        e.currentTarget,
        { scale: 1 },
        { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
      );

      setDebates((prev) =>
        prev.map((debate) =>
          debate._id === id ? data : debate
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error liking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base sm:text-lg font-medium text-gray-600">
            Loading debates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden"
    >
      {/* Dynamic padding: Mobile par p-4, tablets par p-6, desktop par p-8/10 */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:py-12 md:px-8">

        {/* ✅ Page Title */}
        <h2 className="page-title text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 text-gray-800 tracking-tight text-center sm:text-left">
          🔥 Explore Discussions
        </h2>

        {debates.length === 0 ? (
          <p className="text-gray-500 text-base sm:text-lg text-center sm:text-left">
            No discussions yet
          </p>
        ) : (
          /* Responsive Grid Breakpoints & Adaptive Gaps */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
            {debates.map((debate) => {
              const alreadyVoted =
                user && debate.votedBy?.includes(user._id);

              return (
                <div
                  key={debate._id}
                  className="debate-card group relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-lg border border-white/40 hover:shadow-2xl transition duration-500 md:hover:-translate-y-2 flex flex-col justify-between"
                >

                  {/* 🔥 Glow Layer (Click Fix Applied) */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-2xl transition duration-500"></div>

                  <div className="w-full">
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-semibold mb-2.5 text-indigo-600 group-hover:text-purple-600 transition break-words line-clamp-2">
                      <Link to={`/debate/${debate._id}`} className="hover:underline focus:outline-none">
                        {debate.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 mb-5 line-clamp-3 leading-relaxed break-words">
                      {debate.description}
                    </p>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100/60 w-full gap-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                      ❤️ {debate.votedBy?.length || 0} Likes
                    </span>

                    <button
                      onClick={(e) => handleVote(debate._id, e)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm transition active:scale-95 ${
                        alreadyVoted
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-pink-100"
                      }`}
                    >
                      {alreadyVoted ? "❤️ Liked" : "🤍 Like"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;






// import { useEffect, useState, useRef } from "react";
// import api from "../api/axios";
// import { Link } from "react-router-dom";
// import { gsap } from "gsap";

// const Dashboard = () => {
//   const [debates, setDebates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const containerRef = useRef(null);

//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   // 🔥 Fetch Debates
//   useEffect(() => {
//     const fetchDebates = async () => {
//       try {
//         const { data } = await api.get("/debates");
//         setDebates(data);
//       } catch (error) {
//         console.error("Error fetching debates", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDebates();
//   }, []);

//   // 🔥 Stable GSAP Animation
//   useEffect(() => {
//     if (loading || debates.length === 0) return;

//     const ctx = gsap.context(() => {
//       // Title Animation
//       gsap.fromTo(
//         ".page-title",
//         { y: -40, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
//       );

//       // Cards Animation
//       gsap.fromTo(
//         ".debate-card",
//         { y: 50, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.8,
//           stagger: 0.15,
//           ease: "power3.out",
//         }
//       );
//     }, containerRef);

//     return () => ctx.revert();
//   }, [loading, debates]);

//   // 🔥 Like Animation
//   const handleVote = async (id, e) => {
//     try {
//       const { data } = await api.post(`/debates/${id}/vote`);

//       // Button pop animation
//       gsap.fromTo(
//         e.currentTarget,
//         { scale: 1 },
//         { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
//       );

//       setDebates((prev) =>
//         prev.map((debate) =>
//           debate._id === id ? data : debate
//         )
//       );
//     } catch (error) {
//       alert(error.response?.data?.message || "Error liking");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//         <p className="text-lg font-medium text-gray-600">
//           Loading debates...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={containerRef}
//       className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
//     >
//       <div className="max-w-7xl mx-auto p-10">

//         {/* ✅ Page Title */}
//         <h2 className="page-title text-4xl font-bold mb-12 text-gray-800 tracking-tight">
//           🔥 Explore Discussion
//         </h2>

//         {debates.length === 0 ? (
//           <p className="text-gray-500 text-lg">
//             No discussions yet
//           </p>
//         ) : (
//           <div className="grid md:grid-cols-3 gap-10">
//             {debates.map((debate) => {
//               const alreadyVoted =
//                 user && debate.votedBy?.includes(user._id);

//               return (
//                 <div
//                   key={debate._id}
//                   className="debate-card group relative bg-white/80 backdrop-blur-xl rounded-3xl p-7 shadow-xl border border-white/40 hover:shadow-2xl transition duration-500 hover:-translate-y-2"
//                 >

//                   {/* 🔥 Glow Layer (Click Fix Applied) */}
//                   <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-2xl transition duration-500"></div>

//                   {/* Title */}
//                   <h3 className="text-xl font-semibold mb-3 text-indigo-600 group-hover:text-purple-600 transition">
//                     <Link to={`/debate/${debate._id}`}>
//                       {debate.title}
//                     </Link>
//                   </h3>

//                   {/* Description */}
//                   <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
//                     {debate.description}
//                   </p>

//                   {/* Bottom Section */}
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-gray-700">
//                       ❤️ {debate.votedBy?.length || 0} Likes
//                     </span>

//                     <button
//                       onClick={(e) => handleVote(debate._id, e)}
//                       className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium shadow-md transition ${
//                         alreadyVoted
//                           ? "bg-pink-500 text-white"
//                           : "bg-gray-100 text-gray-600 hover:bg-pink-100"
//                       }`}
//                     >
//                       {alreadyVoted ? "❤️ Liked" : "🤍 Like"}
//                     </button>
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Dashboard;
