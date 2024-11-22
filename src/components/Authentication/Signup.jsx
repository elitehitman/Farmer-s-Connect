import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Clear all data from localStorage when Home component mounts
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      return;
    }

    console.log("Sending data:", { username, password, role });

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        username,
        password,
        role,
      });

      if (response.status === 201) {
        // Check for successful response
        setSuccess("Sign Up Successful");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        navigate("/login");
      }
    } catch (error) {
      // If there's a response from the server, we can extract the error message
      if (error.response) {
        setError(
          error.response.data.message || "An error occurred during signup"
        );
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <>
      <section className="relative bg-green-600 h-screen flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="bg-white items-center justify-center h-auto w-96 border border-black flex-col p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <h1 className="font-bold text-xl text-green-600 mb-5">Sign Up</h1>
              {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
              {/* Display error messages */}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full mb-4 p-2 border ${
                  error.includes("Username")
                    ? "border-red-500"
                    : "border-gray-500"
                } rounded`} // Highlight on error
              />
              <input
                type="password" // Use type="password" for security
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full mb-4 p-2 border ${
                  error.includes("Password")
                    ? "border-red-500"
                    : "border-gray-500"
                } rounded`} // Highlight on error
              />
              <input
                type="password" // Use type="password" for security
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full mb-4 p-2 border ${
                  error.includes("Passwords do not match")
                    ? "border-red-500"
                    : "border-gray-500"
                } rounded`} // Highlight on error
              />
              <select
                className={`w-full p-2 border ${
                  error.includes("role") ? "border-red-500" : "border-gray-300"
                } rounded mt-1`} // Highlight on error
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
              <div className="mb-4" /> {/* Add this line for spacing */}
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded border border-black"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
