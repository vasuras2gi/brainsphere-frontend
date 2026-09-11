import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { gsap } from "gsap";

const Resources = () => {
  const containerRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("youtube");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("/resources");
      setResources(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    if (resources.length === 0) return; // Fix: Stop animation triggers on empty arrays

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-title",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".upload-card",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" },
      );

      gsap.fromTo(
        ".resource-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [resources]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("isPublic", isPublic ? "true" : "false");

      if (["youtube", "playlist", "pdf-link"].includes(type)) {
        formData.append("url", url);
      }

      if (["video", "pdf-file"].includes(type) && file) {
        formData.append("file", file);
      }

      await axios.post("/resources", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDescription("");
      setUrl("");
      setFile(null);
      setIsPublic(true);

      fetchResources();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      await axios.post(`/resources/${id}/download`);
      fetchResources();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-6 sm:p-6 md:p-8 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="page-title text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 mb-6 sm:mb-8 md:mb-10 text-center sm:text-left tracking-tight">
          Learning Resources
        </h2>

        {user && (
          <form
            onSubmit={handleSubmit}
            className="upload-card bg-white/70 backdrop-blur-xl border border-white/40 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl mb-8 sm:mb-14 w-full"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
              Upload Resource
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-3 rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition bg-white"
                required
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-3 rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition bg-white cursor-pointer"
              >
                <option value="youtube">YouTube Video</option>
                <option value="playlist">YouTube Playlist</option>
                <option value="pdf-link">PDF Link</option>
                <option value="pdf-file">Upload PDF</option>
                <option value="video">Upload Video</option>
              </select>
            </div>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full border p-3 rounded-xl mt-4 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none bg-white"
            />

            {["youtube", "playlist", "pdf-link"].includes(type) && (
              <input
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border p-3 rounded-xl mt-4 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition bg-white"
                required
              />
            )}

            {["video", "pdf-file"].includes(type) && (
              <input
                type="file"
                accept={type === "video" ? "video/*" : "application/pdf"}
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full mt-4 text-xs sm:text-sm bg-white border p-2.5 rounded-xl file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                required
              />
            )}

            <div className="flex items-center gap-2.5 mt-4 px-1">
              <input
                type="checkbox"
                id="publicResource"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="publicResource"
                className="text-xs sm:text-sm text-gray-600 select-none cursor-pointer"
              >
                Public Resource
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : "sm:hover:scale-105"
              }`}
            >
              {loading ? "Uploading..." : "Save Resource"}
            </button>
          </form>
        )}

        {/* Fixed: Grid transforms seamlessly from 1 column on mobile to 2 columns on desktops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full">
          {resources.map((res) => (
            <div
              key={res._id}
              className="resource-card bg-white/70 backdrop-blur-xl border border-white/40 p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl md:hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between w-full"
            >
              <div className="w-full">
                {/* Fixed: Restructured layout using alignment safeguards to prevent text overlaps on mobile screens */}
                <div className="flex justify-between items-start gap-3 w-full">
                  <h3 className="font-bold text-base sm:text-lg text-gray-800 break-words flex-1">
                    {res.title}
                  </h3>

                  <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-md shrink-0">
                    {res.type}
                  </span>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm mt-2.5 break-words leading-relaxed">
                  {res.description}
                </p>

                {/* Web Url Resource Actions */}
                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleDownload(res._id)}
                    className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm block mt-4 font-semibold hover:underline w-fit break-all"
                  >
                    Open Resource ↗
                  </a>
                )}

                {/* Fixed: Replaced hardcoded localhost strings with production safe URL parsing variables */}
                {res.type === "video" && res.file && (
                  <video
                    src={`${axios.defaults.baseURL ? axios.defaults.baseURL.replace(/\/api$/, "") : "https://onrender.com"}/${res.file}`}
                    controls
                    className="mt-4 rounded-xl w-full max-h-[300px] object-contain bg-black focus:outline-none"
                    onPlay={() => handleDownload(res._id)}
                  />
                )}

                {/* Fixed: PDF live rendering location sync */}
                {res.type === "pdf-file" && res.file && (
                  <a
                    href={`${axios.defaults.baseURL ? axios.defaults.baseURL.replace(/\/api$/, "") : "https://onrender.com"}/${res.file}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleDownload(res._id)}
                    className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm block mt-4 font-semibold hover:underline w-fit"
                  >
                    View PDF Document 📄
                  </a>
                )}
              </div>

              {/* Engagement statistics section with mobile flexible wrap tracking */}
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100/60 text-[10px] sm:text-xs text-gray-500 font-medium w-full gap-2">
                <span className="truncate max-w-[150px] sm:max-w-xs">
                  By: {res.uploadedBy?.name || "Anonymous"}
                </span>
                <span className="whitespace-nowrap">
                  Downloads: {res.downloads || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;





// import { useEffect, useState, useRef } from "react";
// import axios from "../api/axios";
// import { gsap } from "gsap";

// const Resources = () => {
//   const containerRef = useRef(null);
//   const user = JSON.parse(localStorage.getItem("user"));

//   const [resources, setResources] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [type, setType] = useState("youtube");
//   const [url, setUrl] = useState("");
//   const [file, setFile] = useState(null);
//   const [isPublic, setIsPublic] = useState(true);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- FETCH ---------------- */
//   useEffect(() => {
//     fetchResources();
//   }, []);

//   const fetchResources = async () => {
//     try {
//       const res = await axios.get("/resources");
//       setResources(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /* ---------------- GSAP ANIMATION ---------------- */
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".page-title",
//         { y: -40, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
//       );

//       gsap.fromTo(
//         ".upload-card",
//         { y: 60, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
//       );

//       gsap.fromTo(
//         ".resource-card",
//         { y: 40, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.6,
//           stagger: 0.1,
//           delay: 0.4,
//           ease: "power3.out",
//         }
//       );
//     }, containerRef);

//     return () => ctx.revert();
//   }, [resources]);

//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("type", type);
//       formData.append("isPublic", isPublic ? "true" : "false");

//       if (["youtube", "playlist", "pdf-link"].includes(type)) {
//         formData.append("url", url);
//       }

//       if (["video", "pdf-file"].includes(type) && file) {
//         formData.append("file", file);
//       }

//       await axios.post("/resources", formData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setTitle("");
//       setDescription("");
//       setUrl("");
//       setFile(null);
//       setIsPublic(true);

//       fetchResources();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (id) => {
//     try {
//       await axios.post(`/resources/${id}/download`);
//       fetchResources();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6"
//     >
//       <div className="max-w-6xl mx-auto">

//         <h2 className="page-title text-4xl font-bold text-indigo-600 mb-10">
//           Learning Resources
//         </h2>

// {/* ---------------- UPLOAD FORM ---------------- */}
// {user && (
//   <form
//     onSubmit={handleSubmit}
//     className="upload-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl mb-14"
//   >
//     <h3 className="text-2xl font-semibold mb-6 text-gray-800">
//       Upload Resource
//     </h3>

//     <div className="grid md:grid-cols-2 gap-4">
//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
//         required
//       />

//       <select
//         value={type}
//         onChange={(e) => setType(e.target.value)}
//         className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
//       >
//         <option value="youtube">YouTube Video</option>
//         <option value="playlist">YouTube Playlist</option>
//         <option value="pdf-link">PDF Link</option>
//         <option value="pdf-file">Upload PDF</option>
//         <option value="video">Upload Video</option>
//       </select>
//     </div>

//     <textarea
//       placeholder="Description"
//       value={description}
//       onChange={(e) => setDescription(e.target.value)}
//       className="w-full border p-3 rounded-xl mt-4 focus:ring-2 focus:ring-indigo-400 outline-none"
//     />

//     {["youtube", "playlist", "pdf-link"].includes(type) && (
//       <input
//         type="text"
//         placeholder="Enter URL"
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//         className="w-full border p-3 rounded-xl mt-4 focus:ring-2 focus:ring-indigo-400 outline-none"
//         required
//       />
//     )}

//     {["video", "pdf-file"].includes(type) && (
//       <input
//         type="file"
//         accept={type === "video" ? "video/*" : "application/pdf"}
//         onChange={(e) => setFile(e.target.files[0])}
//         className="w-full mt-4"
//         required
//       />
//     )}

//     <div className="flex items-center gap-3 mt-4">
//       <input
//         type="checkbox"
//         checked={isPublic}
//         onChange={() => setIsPublic(!isPublic)}
//       />
//       <label className="text-sm">Public Resource</label>
//     </div>

//     <button
//       type="submit"
//       disabled={loading}
//       className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
//     >
//       {loading ? "Uploading..." : "Save Resource"}
//     </button>
//   </form>
// )}

{
  /* ---------------- RESOURCE LIST ---------------- */
}
//         <div className="grid md:grid-cols-2 gap-8">
//           {resources.map((res) => (
//             <div
//               key={res._id}
//               className="resource-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
//             >
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-lg text-gray-800">
//                   {res.title}
//                 </h3>

//                 <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
//                   {res.type}
//                 </span>
//               </div>

//               <p className="text-gray-600 text-sm mt-3">
//                 {res.description}
//               </p>

//               {res.url && (
//                 <a
//                   href={res.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   onClick={() => handleDownload(res._id)}
//                   className="text-indigo-600 text-sm block mt-4 font-medium hover:underline"
//                 >
//                   Open Resource →
//                 </a>
//               )}

//               {res.type === "video" && res.file && (
//                 <video
//                   src={`http://localhost:5000/${res.file}`}
//                   controls
//                   className="mt-4 rounded-xl w-full"
//                   onPlay={() => handleDownload(res._id)}
//                 />
//               )}

//               {res.type === "pdf-file" && res.file && (
//                 <a
//                   href={`http://localhost:5000/${res.file}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   onClick={() => handleDownload(res._id)}
//                   className="text-indigo-600 text-sm block mt-4 font-medium hover:underline"
//                 >
//                   View PDF →
//                 </a>
//               )}

//               <div className="flex justify-between mt-5 text-xs text-gray-500">
//                 <span>Uploaded by: {res.uploadedBy?.name}</span>
//                 <span>Download: {res.downloads || 0}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Resources;
