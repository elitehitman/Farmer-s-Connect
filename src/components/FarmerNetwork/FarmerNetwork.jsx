import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../General/Sidebar"; // Assuming Sidebar is in the same folder

const FarmerNetwork = () => {
  const [farmers, setFarmers] = useState([]); // This will hold the list of farmers
  const [loading, setLoading] = useState(true);

  // Fetch all farmers from the server
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        // Fetch all farmers from the new endpoint
        const response = await axios.get("http://localhost:3000/getallfarmers");

        setFarmers(response.data); // Set the fetched farmer data
      } catch (error) {
        console.log("Error fetching farmers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers(); // Fetch farmers when the component mounts
  }, []);

  // Save farmer's username and name to localStorage
  const handleSaveFarmerDetails = (username, name) => {
    localStorage.setItem("farmer_username", username);
    localStorage.setItem("farmer_name", name);
    alert(`Farmer ${name} (username: ${username}) saved to localStorage!`);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Farmer Network
        </h1>

        {/* Loading state */}
        {loading ? (
          <div>Loading farmers...</div>
        ) : (
          <div className="space-y-4">
            {farmers.length > 0 ? (
              farmers.map((farmer) => (
                <div
                  key={farmer._id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex space-x-6"
                >
                  {/* Text Section */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {farmer.name}
                    </h2>
                    <p className="text-gray-600">Location: {farmer.location}</p>
                    <p className="text-gray-600">
                      Experience: {farmer.experience}
                    </p>
                    <p className="text-gray-600">Contact: {farmer.contact}</p>

                    {/* Profile Image */}
                    {farmer.profileImage && (
                      <div className="mt-4">
                        <img
                          src={farmer.profileImage}
                          alt={farmer.name}
                          className="w-32 h-32 object-cover rounded-full"
                        />
                      </div>
                    )}

                    {/* Save Farmer Details Button */}
                    <button
                      onClick={() =>
                        handleSaveFarmerDetails(farmer.username, farmer.name)
                      }
                      className="w-12 h-12 relative -top-20 left-40 bg-green-500 text-white font-bold rounded-full flex items-center justify-center hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>

                  {/* Farm Images Section */}
                  <div className="flex space-x-4">
                    {/* Farm Image 1 */}
                    {farmer.farmImage1 && (
                      <img
                        src={farmer.farmImage1}
                        alt={`Farm Image 1 of ${farmer.name}`}
                        className="w-1/4 h-1/3 absolute right-1/3 object-cover rounded-lg"
                      />
                    )}

                    {/* Farm Image 2 */}
                    {farmer.farmImage2 && (
                      <img
                        src={farmer.farmImage2}
                        alt={`Farm Image 2 of ${farmer.name}`}
                        className="w-1/4 h-1/3 absolute right-16 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No farmers found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerNetwork;
