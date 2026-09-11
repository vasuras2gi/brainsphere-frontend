import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const Leaderboard = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchTopDebates = async () => {
      try {
        const { data } = await api.get("/debates/top");
        setDebates(data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDebates();
  }, []);

  // 🔥 GSAP Premium Animation
  useEffect(() => {
    if (loading || debates.length === 0) return;

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.fromTo(
        ".leaderboard-title",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Cards Stagger Animation
      gsap.fromTo(
        ".leaderboard-card",
        { y: 60, opacity: 0 },
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm sm:text-base font-medium animate-pulse">Calculating rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-6 sm:py-8 md:py-12 px-4 sm:px-6 overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto w-full">

        {/* 🔥 Animated Title */}
        <h2 className="leaderboard-title text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 text-indigo-700 tracking-tight text-center sm:text-left">
          🏆 Top Discussions
        </h2>

        {debates.length === 0 ? (
          <p className="text-gray-400 text-center py-10 bg-white rounded-2xl shadow-sm text-sm sm:text-base">
            No discussions found on the leaderboard yet.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {debates.map((debate, index) => (
              <div
                key={debate._id}
                className="leaderboard-card group relative bg-white/70 backdrop-blur-xl p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl shadow-lg border border-white/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition duration-500 md:hover:-translate-y-2 md:hover:shadow-2xl w-full"
              >
                {/* Glow Layer */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-2xl transition duration-500"></div>

                {/* Left Section (Flexible width and word breaks) */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-indigo-600 group-hover:text-purple-600 transition break-words">
                    <Link to={`/debate/${debate._id}`} className="hover:underline focus:outline-none">
                      #{index + 1} {debate.title}
                    </Link>
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">
                    By {debate.createdBy?.name || "Anonymous"}
                  </p>
                </div>

                {/* Right Section (Dynamic grid/flex change for mobile screen alignment) */}
                <div className="flex sm:flex-col justify-between sm:text-right pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0 gap-1.5 shrink-0">
                  <p className="text-indigo-600 font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
                    AI Score: <span className="bg-indigo-50 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded text-indigo-700 sm:text-indigo-600">{debate.aiScore?.overallScore || 0}</span>
                  </p>

                  <p className="text-pink-500 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
                    ❤️ {debate.votedBy?.length || 0} Likes
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;



// import { useEffect, useState, useRef } from "react";
// import api from "../api/axios";
// import { Link } from "react-router-dom";
// import { gsap } from "gsap";

// const Leaderboard = () => {
//   const [debates, setDebates] = useState([]);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const fetchTopDebates = async () => {
//       try {
//         const { data } = await api.get("/debates/top");
//         setDebates(data);
//       } catch (error) {
//         console.error("Error fetching leaderboard", error);
//       }
//     };

//     fetchTopDebates();
//   }, []);

//   // 🔥 GSAP Premium Animation
//   useEffect(() => {
//     if (debates.length === 0) return;

//     const ctx = gsap.context(() => {
//       // Title Animation
//       gsap.fromTo(
//         ".leaderboard-title",
//         { y: -50, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
//       );

//       // Cards Stagger Animation
//       gsap.fromTo(
//         ".leaderboard-card",
//         { y: 60, opacity: 0 },
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
//   }, [debates]);

//   return (
//     <div
//       ref={containerRef}
//       className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-10"
//     >
//       <div className="max-w-4xl mx-auto">

//         {/* 🔥 Animated Title */}
//         <h2 className="leaderboard-title text-4xl font-bold mb-12 text-indigo-700 tracking-tight">
//           🏆 Top Discussions
//         </h2>

//         <div className="space-y-8">
//           {debates.map((debate, index) => (
//             <div
//               key={debate._id}
//               className="leaderboard-card group relative bg-white/70 backdrop-blur-xl p-7 rounded-3xl shadow-xl border border-white/40 flex justify-between items-center transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
//             >
//               {/* Glow Layer */}
//               <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-2xl transition duration-500"></div>

//               {/* Left Section */}
//               <div>
//                 <h3 className="text-xl font-semibold text-indigo-600 group-hover:text-purple-600 transition">
//                   <Link to={`/debate/${debate._id}`}>
//                     #{index + 1} {debate.title}
//                   </Link>
//                 </h3>

//                 <p className="text-gray-500 text-sm mt-1">
//                   By {debate.createdBy?.name}
//                 </p>
//               </div>

//               {/* Right Section */}
//               <div className="text-right">
//                 <p className="text-indigo-600 font-bold text-lg">
//                   AI Score: {debate.aiScore?.overallScore || 0}
//                 </p>

//                 <p className="text-pink-500 font-medium">
//                   ❤️ {debate.votedBy?.length || 0} Likes
//                 </p>
//               </div>

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Leaderboard;
