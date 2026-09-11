import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.email || !formData.password) {
      return setErrorMsg("Please fill all fields");
    }

    if (formData.password.length < 6) {
      return setErrorMsg("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", formData);
      login(data);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-8 overflow-y-auto">
      
      {/* Fixed: Width handles seamlessly across devices with responsive padding */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md border border-white/40">

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600 mb-1.5 sm:mb-2 tracking-tight">
          Create Account 🚀
        </h2>

        <p className="text-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
          Join BrainSphere and start debating
        </p>

        {/* Inline Error UI Banner (Replaces harsh native alerts) */}
        {errorMsg && (
          <div className="bg-red-100 text-red-600 text-xs sm:text-sm p-3 rounded-xl mb-4 break-words font-medium animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 w-full">

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition bg-slate-50/50"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition bg-slate-50/50"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-indigo-400 outline-none transition bg-slate-50/50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl shadow-md text-xs sm:text-sm md:text-base font-medium sm:font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed sm:hover:scale-[1.02]"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-xs sm:text-sm text-center mt-5 sm:mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline focus:outline-none">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;




// import { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
// import { AuthContext } from "../context/AuthContext";

// const Register = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.password) {
//       return alert("Please fill all fields");
//     }

//     if (formData.password.length < 6) {
//       return alert("Password must be at least 6 characters");
//     }

//     try {
//       setLoading(true);
//       const { data } = await api.post("/auth/register", formData);
//       login(data);
//       navigate("/");
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

//       <div className="bg-white p-10 rounded-3xl shadow-2xl w-[420px]">

//         <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
//           Create Account 🚀
//         </h2>

//         <p className="text-center text-gray-500 mb-8">
//           Join BrainSphere and start debating
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-5">

//           <input
//             type="text"
//             name="name"
//             placeholder="Enter your name"
//             value={formData.name}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Enter your password"
//             value={formData.password}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl shadow hover:scale-105 transition disabled:opacity-50"
//           >
//             {loading ? "Creating account..." : "Register"}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Already have an account?{" "}
//           <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
//             Login
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Register;
