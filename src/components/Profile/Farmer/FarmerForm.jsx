import { useState, useEffect } from "react";
import axios from "axios";

const FarmerForm = () => {
  const [FormData, setFormData] = useState({
    name: "",
    contact: 0,
    location: "",
    experience: "",
    personalInfo: "",
    verification_status: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [Image, setImage] = useState(false);

  const username = localStorage.getItem("username");

  const sendFarmerData = async () => {
    try {
      const formData = new FormData();

      // Append text data
      formData.append("username", username);
      formData.append("name", FormData.name);
      formData.append("contact", FormData.contact);
      formData.append("location", FormData.location);
      formData.append("experience", FormData.experience);
      formData.append("personalInfo", FormData.personalInfo);
      formData.append("verification_status", FormData.verification_status);

      // Append images (make sure these variables hold the actual File objects)
      if (FormData.profileImage) {
        formData.append("profileImage", FormData.profileImage);
      }
      if (FormData.farmImage1) {
        formData.append("farmImage1", FormData.farmImage1);
      }
      if (FormData.farmImage2) {
        formData.append("farmImage2", FormData.farmImage2);
      }

      const response = await axios.post(
        "http://localhost:3000/sendfarmerprofile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for sending FormData
          },
        }
      );

      if (response.status === 200) {
        console.log("Data added correctly!", response.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL); // For displaying the preview

      // Store the file in form data or state object to be used in submission
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: file,
      }));
    }
  };

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getfarmerprofile",
          { params: { username: username } }
        );
        setFormData(response.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmerData();
  }, []);

  const [isOpen, setIsOpen] = useState(FormData.name == "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (FormData.name == "") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [FormData.name]);

  useEffect(() => {
    if (!loading) {
      setIsOpen(FormData.name === "");
    }
  }, [FormData.name, loading]);

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

  console.log(isEditing);

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
                value={FormData.name}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => {
                  setFormData({ ...FormData, name: e.target.value });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact:</label>
              <input
                type="text"
                placeholder="Enter your contact number"
                value={FormData.contact}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => {
                  setFormData({ ...FormData, contact: e.target.value });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location:</label>
              <input
                type="text"
                placeholder="Enter your location"
                value={FormData.location}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => {
                  setFormData({ ...FormData, location: e.target.value });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Experience:</label>
              <input
                type="text"
                placeholder="Enter your experience"
                value={FormData.experience}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => {
                  setFormData({ ...FormData, experience: e.target.value });
                }}
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
            <span className="text-gray-600">{FormData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Contact:</span>
            <span className="text-gray-600">{FormData.contact}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Location:</span>
            <span className="text-gray-600">{FormData.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Experience:</span>
            <span className="text-gray-600">{FormData.experience}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-10 right-1/3 p-4 bg-white bg-opacity-90 rounded-lg shadow-md w-1/5">
        <div>Personal Info: {FormData.personalInfo}</div>
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
        {/* Clickable label to upload image */}
        <label className="w-full h-full flex items-center justify-center cursor-pointer">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Selected"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="bg-slate-400 w-full h-full flex items-center justify-center rounded-full">
              <span className="text-white">Add Image Here</span>
            </div>
          )}
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "profileImage")} // Update to call with the specific field name
            className="hidden"
          />
        </label>
      </div>
    </>
  );
};

export default FarmerForm;
