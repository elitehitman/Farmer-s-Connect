import { useState, useEffect } from "react";
import axios from "axios";

const FarmerForm = () => {
  const [formDataState, setFormDataState] = useState({
    name: "",
    contact: 0,
    location: "",
    experience: "",
    // personalInfo: "",
    verification_status: false,
    profileImage: null,
    // farmImage1: null,
    // farmImage2: null,
  });

  // const [imageDataState, setImageDataState] = useState({
  //   profileImage: null,
  //   farmImage1: null,
  //   farmImage2: null,
  // });

  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const username = localStorage.getItem("username");

  // Submit data to the server
  console.log("profileImage:", formDataState.profileImage);
  // console.log("farmImage1:", formDataState.farmImage1);
  // console.log("farmImage2:", formDataState.farmImage2);

  const sendFarmerData = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", formDataState.name);
    formData.append("contact", formDataState.contact);
    formData.append("location", formDataState.location);
    formData.append("experience", formDataState.experience);
    // formData.append("personalInfo", formDataState.personalInfo);

    // Check if the files exist before appending them
    if (formDataState.profileImage) {
      formData.append("profileImage", formDataState.profileImage);
    }
    // if (formDataState.farmImage1) {
    //   formData.append("farmImage1", formDataState.farmImage1);
    // }
    // if (formDataState.farmImage2) {
    //   formData.append("farmImage2", formDataState.farmImage2);
    // }

    try {
      const response = await axios.post(
        "http://localhost:3000/sendfarmerprofile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle image selection
  const handleImageChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);

      setFormDataState((prevState) => ({
        ...prevState,
        [fieldName]: file,
      }));
    }
  };

  // Fetch farmer data from server
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getfarmerprofile",
          { params: { username } }
        );
        // Make sure profileImage is a valid URL or file path
        setFormDataState(response.data);
        if (
          response.data.name &&
          response.data.contact &&
          response.data.location &&
          response.data.experience
        ) {
          setIsOpen(false); // Hide the form if data exists
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmerData();
  }, [username]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendFarmerData();
    setIsOpen(false);
    setIsEditing(false);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  if (loading) return null;

  return (
    <>
      {(isOpen || isEditing) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 bg-white rounded-lg shadow-lg z-50">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
            Farmer Information
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formDataState.name}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) =>
                  setFormDataState({ ...formDataState, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact:</label>
              <input
                type="text"
                placeholder="Enter your contact number"
                value={formDataState.contact}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) =>
                  setFormDataState({
                    ...formDataState,
                    contact: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location:</label>
              <input
                type="text"
                placeholder="Enter your location"
                value={formDataState.location}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) =>
                  setFormDataState({
                    ...formDataState,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Experience:</label>
              <input
                type="text"
                placeholder="Enter your experience"
                value={formDataState.experience}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) =>
                  setFormDataState({
                    ...formDataState,
                    experience: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
                className="text-red-500 hover:text-red-700"
              >
                X
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="absolute top-10 left-1/4 p-4 bg-white bg-opacity-90 rounded-lg shadow-md w-1/5">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Name:</span>
            <span className="text-gray-600">{formDataState.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Contact:</span>
            <span className="text-gray-600">{formDataState.contact}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Location:</span>
            <span className="text-gray-600">{formDataState.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Experience:</span>
            <span className="text-gray-600">{formDataState.experience}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-10 right-1/3 p-4 bg-white bg-opacity-90 rounded-lg shadow-md w-1/5">
        <div>Personal Info: {formDataState.personalInfo}</div>
      </div>
      <div>
        <button
          className="absolute top-8 hover:bg-cyan-500 right-10 p-2.5 bg-cyan-400 bg-opacity-90 rounded-lg shadow-black shadow-md w-32"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Update
        </button>
      </div>
      <div className="absolute top-4 left-14 p-4 bg-white bg-opacity-90 rounded-full shadow-md w-60 h-60 flex flex-col items-center justify-center">
        {/* Check if the profileImage exists */}
        {formDataState.profileImage ? (
          <img
            src={formDataState.profileImage} // If profileImage is a URL, directly use it
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="bg-slate-400 w-full h-full flex items-center justify-center rounded-full">
            {/* Placeholder content can go here */}
            <span>No Image</span>
          </div>
        )}

        {/* File input for image upload */}
        <label className="w-full h-full flex items-center justify-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setFormDataState({
                ...formDataState,
                profileImage: file, // Store the file in state for upload
              });
            }}
            className="hidden"
          />
        </label>
      </div>
    </>
  );
};

export default FarmerForm;
