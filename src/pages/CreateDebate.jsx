import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { gsap } from "gsap";

const CreateDebate = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [mode, setMode] = useState("debate");
  const [postType, setPostType] = useState("image");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topicTag: "",
  });

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------- GSAP ENTRY ANIMATION ---------------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".create-card",
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".form-field",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mode]);

  /* ---------------- ERROR SHAKE ---------------- */
  useEffect(() => {
    if (!errorMsg) return;

    gsap.fromTo(
      ".error-box",
      { x: -10 },
      { x: 10, repeat: 3, yoyo: true, duration: 0.1 },
    );
  }, [errorMsg]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);

      if (mode === "debate") {
        if (!formData.title || !formData.description) {
          return setErrorMsg("Title and Description are required");
        }

        await api.post("/debates", formData);
        navigate("/");
      }

      if (mode === "post") {
        if (!caption || !file) {
          return setErrorMsg("Caption and Media required");
        }

        const data = new FormData();
        data.append("caption", caption);
        data.append("type", postType);
        data.append("media", file);

        await api.post("/posts", data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        navigate("/feed");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4"
    >
      <div className="create-card relative bg-white/70 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-white/40">
        {/* Glow Background */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-10 blur-3xl"></div>

        <h2 className="text-3xl font-bold mb-6 text-indigo-600 relative z-10">
          Create Content
        </h2>

        {/* MODE SWITCH */}
        <div className="flex gap-3 mb-6 relative z-10">
          <button
            onClick={() => setMode("debate")}
            className={`flex-1 py-3 rounded-xl transition-all duration-300 font-semibold ${
              mode === "debate"
                ? "bg-black neon-blue shadow-lg scale-105"
                : "bg-black neon-white hover:scale-105"
            }`}
          >
            Discussion
          </button>

          <button
            onClick={() => setMode("post")}
            className={`flex-1 py-3 rounded-xl transition-all duration-300 font-semibold ${
              mode === "post"
                ? "bg-black neon-blue shadow-lg scale-105"
                : "bg-black neon-white hover:scale-105"
            }`}
          >
            Feed Post
          </button>
        </div>

        {errorMsg && (
          <div className="error-box bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4 relative z-10">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 relative z-10"
        >
          {mode === "debate" && (
            <>
              <input
                name="title"
                placeholder="Debate Title"
                value={formData.title}
                onChange={handleChange}
                className="form-field border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />

              <textarea
                name="description"
                placeholder="Write debate description..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="form-field border p-3 rounded-xl resize-none focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />

              <input
                name="topicTag"
                placeholder="Topic Tag (AI, Politics, Tech)"
                value={formData.topicTag}
                onChange={handleChange}
                className="form-field border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
            </>
          )}

          {mode === "post" && (
            <>
              <textarea
                placeholder="Write caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="form-field border p-3 rounded-xl resize-none focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />

              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="form-field border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value="image">Image Post</option>
                <option value="short">60 Sec Short</option>
              </select>

              <input
                type="file"
                accept={postType === "image" ? "image/*" : "video/*"}
                onChange={(e) => setFile(e.target.files[0])}
                className="form-field border p-3 rounded-xl"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`form-field text-white py-3 rounded-xl transition-all duration-300 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 shadow-lg"
            }`}
          >
            {loading
              ? "Processing..."
              : mode === "debate"
                ? "Create Discussion"
                : "Post to Feed"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDebate;
