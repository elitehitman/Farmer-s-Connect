import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../General/Sidebar";

const BuyerForm = () => {
  const [formDataState, setFormDataState] = useState({
    name: "",
    contact: 0,
    location: "",
    description: "",
    company: "",
    verification_status: false,
    profileImage: null,
    companyImage1: null,
    companyImage2: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const [newImageSelected, setNewImageSelected] = useState(false);

  const username = localStorage.getItem("username");

  // Submit data to the server
  console.log("profileImage:", formDataState.profileImage);
  console.log("companyImage1:", formDataState.companyImage1);
  console.log("companyImage2:", formDataState.companyImage2);

  const sendBuyerData = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", formDataState.name);
    formData.append("contact", formDataState.contact);
    formData.append("location", formDataState.location);
    formData.append("description", formDataState.description);
    formData.append("company", formDataState.company);

    // Check if the files exist before appending them
    if (formDataState.profileImage) {
      formData.append("profileImage", formDataState.profileImage);
    }
    if (formDataState.companyImage1) {
      formData.append("companyImage1", formDataState.companyImage1);
    }
    if (formDataState.companyImage2) {
      formData.append("companyImage2", formDataState.companyImage2);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/sendbuyerprofile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Profile updated:", response.data);
      setNewImageSelected(false);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle profile image selection
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormDataState((prevState) => ({
        ...prevState,
        profileImage: file,
      }));
      setNewImageSelected(true);
    }
  };

  // Handle farm image 1 selection
  const handleCompanyImage1Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormDataState((prevState) => ({
        ...prevState,
        companyImage1: file,
      }));
      setNewImageSelected(true);
    }
  };

  // Handle farm image 2 selection
  const handleCompanyImage2Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormDataState((prevState) => ({
        ...prevState,
        companyImage2: file,
      }));
      setNewImageSelected(true);
    }
  };

  // Fetch farmer data from server
  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getbuyerprofile",
          { params: { username } }
        );
        // Make sure profileImage is a valid URL or file path
        setFormDataState(response.data);
        if (
          response.data.name &&
          response.data.contact &&
          response.data.location &&
          response.data.description &&
          response.data.company
        ) {
          setIsOpen(false); // Hide the form if data exists
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyerData();
  }, [username]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendBuyerData();
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
      <Sidebar />
      {(isOpen || isEditing) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 bg-white rounded-lg shadow-lg z-50">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
            Buyer Information
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
              <label className="block text-gray-700">Description:</label>
              <input
                type="text"
                placeholder="Enter your description"
                value={formDataState.description}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) =>
                  setFormDataState({
                    ...formDataState,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Company Info:</label>
              <input
                type="text"
                placeholder="Enter your Company Info"
                value={formDataState.company}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) =>
                  setFormDataState({
                    ...formDataState,
                    company: e.target.value,
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
      <div className="absolute top-10 left-auto p-4 bg-white bg-opacity-90 rounded-lg shadow-md w-1/5">
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
            <span className="font-semibold text-gray-800">Description:</span>
            <span className="text-gray-600">{formDataState.description}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-10 right-60 p-4 bg-white bg-opacity-90 rounded-lg shadow-md w-1/5">
        <div>Company Info: {formDataState.company}</div>
      </div>
      <div>
        {/* <button
          className="absolute top-8 hover:bg-cyan-500 right-10 p-2.5 bg-cyan-400 bg-opacity-90 rounded-lg shadow-black shadow-md w-32"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Update
        </button> */}
      </div>
      <div className="absolute top-4 left-72 p-4 bg-white bg-opacity-90 rounded-full shadow-md w-60 h-60 flex flex-col items-center justify-center">
        {/* Show preview if the image is selected */}
        {formDataState.profileImage ? (
          <img
            src={formDataState.profileImage} // Use the preview URL if available
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="bg-slate-400 w-full h-full flex items-center justify-center rounded-full">
            <span>No Image</span>
          </div>
        )}

        {/* File input for image upload */}
        <label className="w-full h-full flex items-center justify-center cursor-pointer absolute inset-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange} // Handle image change
            className="hidden"
          />
        </label>
      </div>

      {newImageSelected && (
        <div className="absolute top-64 left-72 p-4 h-8 border border-x-slate-800 bg-white flex flex-col items-center justify-center">
          <button onClick={sendBuyerData}>Upload</button>
        </div>
      )}
      <div className="mb-4 absolute top-80 left-72 w-1/3 h-80">
        <label className="block text-gray-700">Company Image 1:</label>
        <div className="relative w-full h-full bg-slate-300 border border-dashed border-gray-400 rounded-md">
          <input
            type="file"
            accept="image/*"
            onChange={handleCompanyImage1Change} // Handle farm image 1 change
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {formDataState.companyImage1 ? (
            <img
              src={formDataState.companyImage1} // Preview image
              alt="Company Image 1"
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-600">
              <span>Company Image 1</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 absolute top-80 right-36 w-1/3 h-80">
        <label className="block text-gray-700">Company Image 2:</label>
        <div className="relative w-full h-full bg-slate-300 border border-dashed border-gray-400 rounded-md">
          <input
            type="file"
            accept="image/*"
            onChange={handleCompanyImage2Change} // Handle farm image 2 change
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {formDataState.companyImage2 ? (
            <img
              src={formDataState.companyImage2} // Preview image
              alt="Company Image 2"
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-600">
              <span>Company Image 2</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyerForm;
