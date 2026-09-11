import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = loggedUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/users/profile/${id}`);
        setData(res.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "/users/profile",
        { name, profilePic },
        {
          headers: {
            Authorization: `Bearer ${loggedUser.token}`
          }
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ ...loggedUser, ...res.data })
      );

      setData((prev) => ({
        ...prev,
        user: { ...prev.user, ...res.data }
      }));

      setEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center relative">

        <img
          src={data.user.profilePic || "/avatar.png"}
          className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-500 object-cover"
          alt="profile"
        />

        <h2 className="text-2xl font-bold mt-4">
          {data.user.name}
        </h2>

        <p className="text-gray-500">{data.user.email}</p>

        {isOwner && (
          <button
            onClick={() => {
              setName(data.user.name);
              setProfilePic(data.user.profilePic);
              setEditOpen(true);
            }}
            className="absolute top-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* POSTS & REELS */}
      <div className="mt-10">

        {data.posts?.length === 0 && (
          <p className="text-gray-500">No posts yet</p>
        )}

        <div className="grid grid-cols-3 gap-3">
          {data.posts?.map((post) => (
            <div
              key={post._id}
              className="relative group cursor-pointer"
            >

              {/* IMAGE POST */}
              {post.type === "image" && (
                <img
                  src={`http://localhost:5000/${post.media}`}
                  alt=""
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              {/* REEL / SHORT */}
              {post.type === "short" && (
                <video
                  src={`http://localhost:5000/${post.media}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                ❤️ {post.likes?.length || 0}
              </div>

            </div>
          ))}
        </div>
      </div>


      {/* Debates */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Debates</h3>

        {data.debates?.length === 0 && (
          <p className="text-gray-500">No debates yet</p>
        )}

        {data.debates?.map((debate) => (
          <div
            key={debate._id}
            className="bg-white p-4 rounded-xl shadow mb-3"
          >
            <h4 className="font-semibold">{debate.title}</h4>
            <p className="text-gray-600 text-sm">
              {debate.description.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>

      {/* Resources */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          Uploaded Resources
        </h3>

        {data.resources?.length === 0 && (
          <p className="text-gray-500">No resources uploaded</p>
        )}

        {data.resources?.map((resource) => (
          <div
            key={resource._id}
            className="bg-white p-4 rounded-xl shadow mb-3"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">{resource.title}</h4>
              <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
                {resource.type}
              </span>
            </div>

            <p className="text-gray-600 text-sm mt-2">
              {resource.description}
            </p>
                        
            {/* LINK RESOURCES */}
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleDownload(resource._id)}
                className="text-indigo-600 text-sm block mt-2"
              >
                Open Resource
              </a>
            )}

            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>
                {resource.isPublic ? "Public" : "Private"}
              </span>
              <span>
                Downloads: {resource.downloads || 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-96 shadow-xl">

            <h2 className="text-xl font-semibold mb-4">
              Edit Profile
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded-lg mb-3"
            />

            <input
              type="text"
              placeholder="Profile Image URL"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              className="w-full border p-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
