import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all data from localStorage when Home component mounts
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      if (response.status == 200) {
        const user = response.data.user;
        localStorage.setItem("role", user.role);
        localStorage.setItem("username", user.username);
        navigate("/profile");
      }
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Server error please try again"
      );
    }
  };

  return (
    <>
      <div>
        <section className="relative bg-green-600 h-screen flex items-center justify-center">
          <div className="relative z-10 text-center">
            <div className="bg-white items-center justify-center h-auto w-96 border border-black flex-col p-6 rounded-lg">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <h1 className="font-bold text-xl text-green-600 mb-5">Login</h1>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="Username"
                  required
                  className={`w-full mb-4 p-2 border border-gray-500 rounded`} // Highlight on error
                />
                <input
                  type="password" // Use type="password" for security
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Password"
                  required
                  className={`w-full mb-4 p-2 border border-gray-500 rounded`} // Highlight on error
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded border border-black"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
