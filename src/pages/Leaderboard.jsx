import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const Leaderboard = () => {
  const [debates, setDebates] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchTopDebates = async () => {
      try {
        const { data } = await api.get("/debates/top");
        setDebates(data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      }
    };

    fetchTopDebates();
  }, []);

  // 🔥 GSAP Premium Animation
  useEffect(() => {
    if (debates.length === 0) return;

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
  }, [debates]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-10"
    >
      <div className="max-w-4xl mx-auto">

        {/* 🔥 Animated Title */}
        <h2 className="leaderboard-title text-4xl font-bold mb-12 text-indigo-700 tracking-tight">
          🏆 Top Discussions
        </h2>

        <div className="space-y-8">
          {debates.map((debate, index) => (
            <div
              key={debate._id}
              className="leaderboard-card group relative bg-white/70 backdrop-blur-xl p-7 rounded-3xl shadow-xl border border-white/40 flex justify-between items-center transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Glow Layer */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-2xl transition duration-500"></div>

              {/* Left Section */}
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 group-hover:text-purple-600 transition">
                  <Link to={`/debate/${debate._id}`}>
                    #{index + 1} {debate.title}
                  </Link>
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  By {debate.createdBy?.name}
                </p>
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="text-indigo-600 font-bold text-lg">
                  AI Score: {debate.aiScore?.overallScore || 0}
                </p>

                <p className="text-pink-500 font-medium">
                  ❤️ {debate.votedBy?.length || 0} Likes
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
