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

  // 🔥 Dynamic production URL base logic to replace hardcoded localhost strings
  const BACKEND_URL = axios.defaults.baseURL 
    ? axios.defaults.baseURL.replace(/\/api$/, '') 
    : "https://onrender.com";

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

  // Safe analytics callback handler for clicks
  const handleDownload = (resourceId) => {
    console.log(`Resource metadata tracker parsed for: ${resourceId}`);
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium animate-pulse">Loading Profile Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8 md:space-y-10">

        {/* ========================================== */}
        {/* 🪪 FIXED PROFILE INFOCARD BOX              */}
        {/* ========================================== */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center sm:relative w-full">
          
          <img
            src={data.user.profilePic || "/avatar.png"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500 object-cover shadow-sm shrink-0"
            alt="profile"
          />

          <div className="text-center mt-4 w-full px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words max-w-full">
              {data.user.name}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm truncate max-w-xs mx-auto mt-0.5">
              {data.user.email}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => {
                setName(data.user.name);
                setProfilePic(data.user.profilePic);
                setEditOpen(true);
              }}
              className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6 bg-indigo-600 text-white px-4 py-2 text-xs sm:text-sm font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-sm w-full sm:w-auto"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* ========================================== */}
        {/* 🖼️ POSTS & REELS GRID (RESPONSIVE)        */}
        {/* ========================================== */}
        <div className="w-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 px-1">Gallery Posts</h3>
          
          {data.posts?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6 bg-white rounded-xl border border-slate-100">
              No posts yet
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              {data.posts?.map((post) => (
                <div
                  key={post._id}
                  className="relative group cursor-pointer aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-100/60"
                >
                  {/* IMAGE POST */}
                  {post.type === "image" && (
                    <img
                      src={`${BACKEND_URL}/${post.media}`}
                      alt="User post instance"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* REEL / SHORT */}
                  {post.type === "short" && (
                    <video
                      src={`${BACKEND_URL}/${post.media}`}
                      className="w-full h-full object-cover bg-black"
                    />
                  )}

                  {/* Hover Interaction Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs sm:text-sm font-medium transition-opacity duration-300 pointer-events-none">
                    ❤️ {post.likes?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* 💬 DEBATES ACCORDION LOGIC FRAME           */}
        {/* ========================================== */}
        <div className="w-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 px-1">Debates</h3>

          {data.debates?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6 bg-white rounded-xl border border-slate-100">
              No debates yet
            </p>
          ) : (
            <div className="space-y-3 w-full">
              {data.debates?.map((debate) => (
                <div
                  key={debate._id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 w-full"
                >
                  <h4 className="font-semibold text-sm sm:text-base text-indigo-600 break-words mb-1">
                    {debate.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">
                    {debate.description.slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* 📚 UPLOADED RESOURCES BLOCK               */}
        {/* ========================================== */}
        <div className="w-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 px-1">
            Uploaded Resources
          </h3>

          {data.resources?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6 bg-white rounded-xl border border-slate-100">
              No resources uploaded
            </p>
          ) : (
            <div className="space-y-3 w-full">
              {data.resources?.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 w-full flex flex-col justify-between"
                >
                  <div className="w-full">
                    <div className="flex justify-between items-start gap-2 w-full">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 break-words flex-1">
                        {resource.title}
                      </h4>
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 font-medium rounded shrink-0">
                        {resource.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mt-2 break-words leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                              
                  {/* LINK RESOURCE CHECKS */}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleDownload(resource._id)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm block mt-3 w-fit hover:underline focus:outline-none"
                    >
                      Open Resource ↗
                    </a>
                  )}

                  <div className="flex justify-between mt-4 pt-2 border-t border-slate-50 text-[10px] sm:text-xs text-gray-500 w-full">
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
          )}
        </div>

      </div>

      {/* ========================================== */}
      {/* 🎛️ ELASTIC MODAL REGION                    */}
      {/* ========================================== */}
            {/* ========================================== */}
      {/* 🎛️ ELASTIC MODAL REGION                    */}
      {/* ========================================== */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
              Edit Profile
            </h2>

            <div className="space-y-3 w-full">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition bg-slate-50/50"
              />

              <input
                type="text"
                placeholder="Profile Image URL"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition bg-slate-50/50"
              />
            </div>

            <div className="flex justify-end gap-2.5 mt-5 w-full">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-slate-100 text-gray-600 rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-200 transition active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-indigo-700 transition active:scale-95 shadow-sm"
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






// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "../api/axios";

// const Profile = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   const [editOpen, setEditOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [profilePic, setProfilePic] = useState("");

//   const loggedUser = JSON.parse(localStorage.getItem("user"));
//   const isOwner = loggedUser?._id === id;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`/users/profile/${id}`);
//         setData(res.data);
//       } catch (error) {
//         console.error(error.response?.data || error.message);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   const handleUpdate = async () => {
//     try {
//       const res = await axios.put(
//         "/users/profile",
//         { name, profilePic },
//         {
//           headers: {
//             Authorization: `Bearer ${loggedUser.token}`
//           }
//         }
//       );

//       localStorage.setItem(
//         "user",
//         JSON.stringify({ ...loggedUser, ...res.data })
//       );

//       setData((prev) => ({
//         ...prev,
//         user: { ...prev.user, ...res.data }
//       }));

//       setEditOpen(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!data) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">

//       {/* Profile Card */}
//       <div className="bg-white p-8 rounded-3xl shadow-lg text-center relative">

//         <img
//           src={data.user.profilePic || "/avatar.png"}
//           className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-500 object-cover"
//           alt="profile"
//         />

//         <h2 className="text-2xl font-bold mt-4">
//           {data.user.name}
//         </h2>

//         <p className="text-gray-500">{data.user.email}</p>

//         {isOwner && (
//           <button
//             onClick={() => {
//               setName(data.user.name);
//               setProfilePic(data.user.profilePic);
//               setEditOpen(true);
//             }}
//             className="absolute top-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>

//       {/* POSTS & REELS */}
//       <div className="mt-10">

//         {data.posts?.length === 0 && (
//           <p className="text-gray-500">No posts yet</p>
//         )}

//         <div className="grid grid-cols-3 gap-3">
//           {data.posts?.map((post) => (
//             <div
//               key={post._id}
//               className="relative group cursor-pointer"
//             >

//               {/* IMAGE POST */}
//               {post.type === "image" && (
//                 <img
//                   src={`http://localhost:5000/${post.media}`}
//                   alt=""
//                   className="w-full h-40 object-cover rounded-lg"
//                 />
//               )}

//               {/* REEL / SHORT */}
//               {post.type === "short" && (
//                 <video
//                   src={`http://localhost:5000/${post.media}`}
//                   className="w-full h-40 object-cover rounded-lg"
//                 />
//               )}

//               {/* Overlay */}
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
//                 ❤️ {post.likes?.length || 0}
//               </div>

//             </div>
//           ))}
//         </div>
//       </div>


//       {/* Debates */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold mb-4">Debates</h3>

//         {data.debates?.length === 0 && (
//           <p className="text-gray-500">No debates yet</p>
//         )}

//         {data.debates?.map((debate) => (
//           <div
//             key={debate._id}
//             className="bg-white p-4 rounded-xl shadow mb-3"
//           >
//             <h4 className="font-semibold">{debate.title}</h4>
//             <p className="text-gray-600 text-sm">
//               {debate.description.slice(0, 100)}...
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Resources */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold mb-4">
//           Uploaded Resources
//         </h3>

//         {data.resources?.length === 0 && (
//           <p className="text-gray-500">No resources uploaded</p>
//         )}

//         {data.resources?.map((resource) => (
//           <div
//             key={resource._id}
//             className="bg-white p-4 rounded-xl shadow mb-3"
//           >
//             <div className="flex justify-between items-center">
//               <h4 className="font-semibold">{resource.title}</h4>
//               <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
//                 {resource.type}
//               </span>
//             </div>

//             <p className="text-gray-600 text-sm mt-2">
//               {resource.description}
//             </p>
                        
//             {/* LINK RESOURCES */}
//             {resource.url && (
//               <a
//                 href={resource.url}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={() => handleDownload(resource._id)}
//                 className="text-indigo-600 text-sm block mt-2"
//               >
//                 Open Resource
//               </a>
//             )}

//             <div className="flex justify-between mt-3 text-xs text-gray-500">
//               <span>
//                 {resource.isPublic ? "Public" : "Private"}
//               </span>
//               <span>
//                 Downloads: {resource.downloads || 0}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Edit Modal */}
//       {editOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-3xl w-96 shadow-xl">

//             <h2 className="text-xl font-semibold mb-4">
//               Edit Profile
//             </h2>

//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border p-2 rounded-lg mb-3"
//             />

//             <input
//               type="text"
//               placeholder="Profile Image URL"
//               value={profilePic}
//               onChange={(e) => setProfilePic(e.target.value)}
//               className="w-full border p-2 rounded-lg mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setEditOpen(false)}
//                 className="px-4 py-2 bg-gray-300 rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleUpdate}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
//               >
//                 Save
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Profile;



