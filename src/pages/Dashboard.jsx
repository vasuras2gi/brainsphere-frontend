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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-lg font-medium text-gray-600">
          Loading debates...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      <div className="max-w-7xl mx-auto p-10">

        {/* ✅ Page Title */}
        <h2 className="page-title text-4xl font-bold mb-12 text-gray-800 tracking-tight">
          🔥 Explore Discussion
        </h2>

        {debates.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No discussions yet
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {debates.map((debate) => {
              const alreadyVoted =
                user && debate.votedBy?.includes(user._id);

              return (
                <div
                  key={debate._id}
                  className="debate-card group relative bg-white/80 backdrop-blur-xl rounded-3xl p-7 shadow-xl border border-white/40 hover:shadow-2xl transition duration-500 hover:-translate-y-2"
                >

                  {/* 🔥 Glow Layer (Click Fix Applied) */}
                  <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-2xl transition duration-500"></div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-indigo-600 group-hover:text-purple-600 transition">
                    <Link to={`/debate/${debate._id}`}>
                      {debate.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                    {debate.description}
                  </p>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      ❤️ {debate.votedBy?.length || 0} Likes
                    </span>

                    <button
                      onClick={(e) => handleVote(debate._id, e)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium shadow-md transition ${
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
