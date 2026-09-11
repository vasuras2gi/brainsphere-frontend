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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-base sm:text-lg font-medium animate-pulse">
            Loading debate...
          </p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <p className="text-center text-gray-600 font-medium text-base sm:text-lg bg-white px-6 py-3 rounded-xl shadow-md">
          ❌ Debate not found
        </p>
      </div>
    );
  }

  const alreadyVoted =
    currentUser && debate.votedBy?.includes(currentUser._id);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 py-6 sm:py-8 md:py-12 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">

        {/* ========================================== */}
        {/* 🔥 DEBATE MAIN CONTENT CARD                */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-7 md:p-8 mb-6 sm:mb-8 md:mb-10 border border-slate-100">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 mb-3 sm:mb-4 break-words leading-tight">
            {debate.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 break-words whitespace-pre-wrap">
            {debate.description}
          </p>

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-3 border-t border-slate-100 w-full gap-2">
            <span className="font-medium text-slate-700 whitespace-nowrap">
              ❤️ {debate.votedBy?.length || 0} Likes
            </span>

            <button
              onClick={handleVote}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-sm transition active:scale-95 ${
                alreadyVoted
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-100"
              }`}
            >
              <span className="text-sm sm:text-base">
                {alreadyVoted ? "❤️" : "🤍"}
              </span>
              <span>{alreadyVoted ? "Liked" : "Like"}</span>
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* 💬 COMMENTS LOGIC SECTION                  */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-7 md:p-8 border border-slate-100">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-5 sm:mb-6 text-gray-800">
            💬 Talk ({debate.comments?.length || 0})
          </h2>

          {/* Comment List Frame */}
          <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-1 sm:pr-2">
            {debate.comments?.length === 0 && (
              <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left py-4">
                No comments yet. Start the conversation!
              </p>
            )}

            {debate.comments?.map((c) => (
              <div
                key={c._id}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/60 items-start w-full"
              >
                <Link to={`/profile/${c.user?._id}`} className="shrink-0 focus:outline-none">
                  <img
                    src={c.user?.profilePic || "/avatar.png"}
                    alt="profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-indigo-50/50"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/profile/${c.user?._id}`}
                    className="font-semibold text-xs sm:text-sm md:text-base text-indigo-600 hover:underline block mb-0.5 truncate"
                  >
                    {c.user?.name || "Unknown User"}
                  </Link>

                  <p className="text-xs sm:text-sm md:text-base text-gray-700 break-words leading-normal">
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Input Fields */}
          <div className="w-full pt-3 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-slate-50/50"
              />

              <button
                onClick={handleComment}
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-black text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-800 transition active:scale-95 shrink-0"
              >
                Comment
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DebateDetail;





// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import api from "../api/axios";

// const DebateDetail = () => {
//   const { id } = useParams();

//   const [debate, setDebate] = useState(null);
//   const [commentText, setCommentText] = useState("");
//   const [loading, setLoading] = useState(true);

//   const currentUser = JSON.parse(localStorage.getItem("user") || "null");

//   useEffect(() => {
//     const fetchDebate = async () => {
//       try {
//         const { data } = await api.get(`/debates/${id}`);
//         setDebate(data);
//       } catch (error) {
//         console.error("Error fetching debate", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDebate();
//   }, [id]);

//   const handleVote = async () => {
//     try {
//       const { data } = await api.post(`/debates/${id}/vote`);
//       setDebate(data);
//     } catch (error) {
//       alert(error.response?.data?.message || "Error liking");
//     }
//   };

//   const handleComment = async () => {
//     if (!commentText.trim()) return;

//     try {
//       const { data: newComment } = await api.post(
//         `/debates/${id}/comment`,
//         {
//           text: commentText,
//         }
//       );

//       // Update debate with new comment
//       setDebate((prev) => ({
//         ...prev,
//         comments: [...(prev.comments || []), newComment],
//       }));

//       setCommentText("");
//     } catch (error) {
//       alert(error.response?.data?.message || "Error adding comment");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-gray-500 text-lg">Loading debate...</p>
//       </div>
//     );

//   if (!debate)
//     return <p className="text-center mt-10">Debate not found</p>;

//   const alreadyVoted =
//     currentUser && debate.votedBy?.includes(currentUser._id);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-6">
//       <div className="max-w-4xl mx-auto">

//         {/* Debate Card */}
//         <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
//           <h1 className="text-3xl font-bold text-indigo-600 mb-4">
//             {debate.title}
//           </h1>

//           <p className="text-gray-700 leading-relaxed mb-6">
//             {debate.description}
//           </p>

//           <div className="flex justify-between items-center text-sm text-gray-500">
//             <span>❤️ {debate.votedBy?.length || 0} Likes</span>

//             <button
//               onClick={handleVote}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow transition ${
//                 alreadyVoted
//                   ? "bg-pink-500 text-white"
//                   : "bg-gray-100 text-gray-600 hover:bg-pink-100"
//               }`}
//             >
//               <span className="text-lg">
//                 {alreadyVoted ? "❤️" : "🤍"}
//               </span>
//               {alreadyVoted ? "Liked" : "Like"}
//             </button>
//           </div>
//         </div>

//         {/* Comments Section */}
//         <div className="bg-white rounded-3xl shadow-xl p-8">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//             💬 Talk ({debate.comments?.length || 0})
//           </h2>

//           {/* Comment List */}
//           <div className="space-y-4 mb-6">
//             {debate.comments?.length === 0 && (
//               <p className="text-gray-400">No comments yet</p>
//             )}

//             {debate.comments?.map((c) => (
//               <div
//                 key={c._id}
//                 className="flex gap-4 p-4 rounded-2xl shadow-sm"
//               >
//                 <Link to={`/profile/${c.user?._id}`}>
//                   <img
//                     src={c.user?.profilePic || "/avatar.png"}
//                     alt="profile"
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                 </Link>

//                 <div>
//                   <Link
//                     to={`/profile/${c.user?._id}`}
//                     className="font-semibold text-indigo-600"
//                   >
//                     {c.user?.name || "Unknown User"}
//                   </Link>

//                   <p>{c.text}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add Comment */}
//           <div>
//             <input
//               type="text"
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               placeholder="Write a comment..."
//               className="w-full p-2 border rounded-lg mb-2"
//             />

//             <button
//               onClick={handleComment}
//               className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//             >
//               Comment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DebateDetail;
