import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Feed = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Base URL detection (safely points to your live Render backend)
  const BACKEND_URL = axios.defaults.baseURL 
    ? axios.defaults.baseURL.replace(/\/api$/, '') 
    : "https://onrender.com"; // Replace with your exact Render domain if needed

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching feed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    if (!user?.token) {
      alert("Please login to like posts");
      return;
    }
    try {
      await axios.post(`/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchFeed();
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm sm:text-base font-medium animate-pulse">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden py-6 sm:py-8 md:py-10">
      {/* Container spacing adjusts comfortably across mobile to desktop */}
      <div className="max-w-2xl mx-auto px-4 space-y-5 sm:space-y-6 md:space-y-8">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight text-center sm:text-left">
          📰 Knowledge Feed
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-10 bg-white rounded-2xl shadow-sm text-sm sm:text-base">
            No posts available right now. Be the first to create one!
          </p>
        ) : (
          posts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 w-full flex flex-col"
            >
              {/* User Header Section */}
              <Link to={`/profile/${post.user?._id}`} className="group focus:outline-none w-fit mb-3"> 
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <img
                    src={post.user?.profilePic || "/avatar.png"}
                    alt={post.user?.name || "User"}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-indigo-50"
                  />
                  <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 group-hover:text-indigo-600 transition truncate max-w-[200px] sm:max-w-xs">
                    {post.user?.name || "Anonymous User"}
                  </span>
                </div>
              </Link>    

              {/* Caption Text Box */}
              <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-4 break-words leading-relaxed whitespace-pre-wrap">
                {post.caption}
              </p>

              {/* Responsive Media Container */}
              {post.media && (
                <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100/60 max-h-[500px] flex items-center justify-center">
                  {post.type === "image" && (
                    <img
                      src={`${BACKEND_URL}/${post.media}`}
                      className="w-full h-full object-contain max-h-[500px] transition-transform duration-500 hover:scale-[1.01]"
                      alt="Feed Media"
                      loading="lazy"
                    />
                  )}

                  {post.type === "short" && (
                    <video
                      src={`${BACKEND_URL}/${post.media}`}
                      controls
                      className="w-full h-full max-h-[500px] rounded-xl focus:outline-none bg-black"
                    />
                  )}
                </div>
              )}

              {/* Like Engagement Button Layout */}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between w-full">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 active:scale-95 transition"
                >
                  ❤️ <span className="text-slate-700">{post.likes?.length || 0} Likes</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;





// import { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { Link } from "react-router-dom";

// const Feed = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetchFeed();
//   }, []);

//   const fetchFeed = async () => {
//     const res = await axios.get("/posts");
//     setPosts(res.data);
//   };

//   const handleLike = async (id) => {
//     await axios.post(`/posts/${id}/like`, {}, {
//       headers: { Authorization: `Bearer ${user.token}` }
//     });
//     fetchFeed();
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-8">
//       <h2 className="text-3xl font-bold">Knowledge Feed</h2>

//       {posts.map((post) => (
//         <div key={post._id} className="bg-white p-5 rounded-xl shadow">

//         <Link to={`/profile/${post.user?._id}`}> 
//           <div className="flex items-center gap-3 mb-3">
//             <img
//               src={post.user?.profilePic}
//               alt=""
//               className="w-8 h-8 rounded-full"
//             />
//             <span className="font-semibold">
//               {post.user?.name}
//             </span>
//           </div>
//         </Link>    

//           <p className="mb-3">{post.caption}</p>

//           {post.type === "image" && (
//             <img
//               src={`http://localhost:5000/${post.media}`}
//               className="rounded-lg"
//               alt=""
//             />
//           )}

//           {post.type === "short" && (
//             <video
//               src={`http://localhost:5000/${post.media}`}
//               controls
//               className="rounded-lg"
//             />
//           )}

//           <button
//             onClick={() => handleLike(post._id)}
//             className="mt-3 text-indigo-600"
//           >
//             ❤️ {post.likes.length} Likes
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Feed;
