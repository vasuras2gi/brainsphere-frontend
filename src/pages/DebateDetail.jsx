import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const DebateDetail = () => {
  const { id } = useParams();

  const [debate, setDebate] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const { data } = await api.get(`/debates/${id}`);
        setDebate(data);
      } catch (error) {
        console.error("Error fetching debate", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id]);

  const handleVote = async () => {
    try {
      const { data } = await api.post(`/debates/${id}/vote`);
      setDebate(data);
    } catch (error) {
      alert(error.response?.data?.message || "Error liking");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const { data: newComment } = await api.post(
        `/debates/${id}/comment`,
        {
          text: commentText,
        }
      );

      // Update debate with new comment
      setDebate((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));

      setCommentText("");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding comment");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading debate...</p>
      </div>
    );

  if (!debate)
    return <p className="text-center mt-10">Debate not found</p>;

  const alreadyVoted =
    currentUser && debate.votedBy?.includes(currentUser._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Debate Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">
            {debate.title}
          </h1>

          <p className="text-gray-700 leading-relaxed mb-6">
            {debate.description}
          </p>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>❤️ {debate.votedBy?.length || 0} Likes</span>

            <button
              onClick={handleVote}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow transition ${
                alreadyVoted
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-100"
              }`}
            >
              <span className="text-lg">
                {alreadyVoted ? "❤️" : "🤍"}
              </span>
              {alreadyVoted ? "Liked" : "Like"}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            💬 Talk ({debate.comments?.length || 0})
          </h2>

          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {debate.comments?.length === 0 && (
              <p className="text-gray-400">No comments yet</p>
            )}

            {debate.comments?.map((c) => (
              <div
                key={c._id}
                className="flex gap-4 p-4 rounded-2xl shadow-sm"
              >
                <Link to={`/profile/${c.user?._id}`}>
                  <img
                    src={c.user?.profilePic || "/avatar.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>

                <div>
                  <Link
                    to={`/profile/${c.user?._id}`}
                    className="font-semibold text-indigo-600"
                  >
                    {c.user?.name || "Unknown User"}
                  </Link>

                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-lg mb-2"
            />

            <button
              onClick={handleComment}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;
