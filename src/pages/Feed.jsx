import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Feed = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const res = await axios.get("/posts");
    setPosts(res.data);
  };

  const handleLike = async (id) => {
    await axios.post(`/posts/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchFeed();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold">Knowledge Feed</h2>

      {posts.map((post) => (
        <div key={post._id} className="bg-white p-5 rounded-xl shadow">

        <Link to={`/profile/${post.user?._id}`}> 
          <div className="flex items-center gap-3 mb-3">
            <img
              src={post.user?.profilePic}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold">
              {post.user?.name}
            </span>
          </div>
        </Link>    

          <p className="mb-3">{post.caption}</p>

          {post.type === "image" && (
            <img
              src={`http://localhost:5000/${post.media}`}
              className="rounded-lg"
              alt=""
            />
          )}

          {post.type === "short" && (
            <video
              src={`http://localhost:5000/${post.media}`}
              controls
              className="rounded-lg"
            />
          )}

          <button
            onClick={() => handleLike(post._id)}
            className="mt-3 text-indigo-600"
          >
            ❤️ {post.likes.length} Likes
          </button>
        </div>
      ))}
    </div>
  );
};

export default Feed;
