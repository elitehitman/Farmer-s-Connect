import { useState, useEffect } from "react";
import Sidebar from "../General/Sidebar";

const ContractFarmer = () => {
  const [farmer, setFarmer] = useState(""); // Stores the farmer's username
  const [farmerName, setFarmerName] = useState(""); // Stores the farmer's name
  const [buyerName, setBuyerName] = useState(""); // Stores the buyer's name
  const [contract, setContract] = useState(null); // Stores contract details
  const [isValidContract, setIsValidContract] = useState(false); // Checks if farmer is part of the contract
  const [cropName, setCropName] = useState(""); // Checks if farmer is part of the contract
  const [contractStatus, setContractStatus] = useState(""); // Tracks contract status (accepted/rejected)

  // Fetch contract details from localStorage based on the farmer's username
  const fetchContractDetails = () => {
    const loggedInUsername = localStorage.getItem("username"); // Farmer logged in
    const farmerUsername = localStorage.getItem("farmer_username"); // Farmer linked to contract

    if (loggedInUsername === farmerUsername) {
      const contractKey = "contract_" + farmerUsername; // Consistent key based on the farmer's username
      const contractDetails = JSON.parse(localStorage.getItem(contractKey));

      if (contractDetails) {
        setContract(contractDetails);
        setIsValidContract(true);
        setContractStatus(contractDetails.contract_status); // Set initial contract status

        // Set contract details in state
        setBuyerName(contractDetails.buyer_name);
        setFarmerName(contractDetails.farmer_name);
        setCropName(contractDetails.crop_name);
      } else {
        setIsValidContract(false);
      }
    } else {
      setIsValidContract(false);
    }
  };

  useEffect(() => {
    fetchContractDetails();
  }, []);

  const handleAccept = () => {
    const loggedInUsername = localStorage.getItem("username"); // Get logged in username
    const farmerUsername = localStorage.getItem("farmer_username"); // Get farmer's username
    const contractKey = "contract_" + farmerUsername; // Construct the key for the contract in localStorage

    const contractDetails = JSON.parse(localStorage.getItem(contractKey)); // Fetch contract details from localStorage

    if (!contractDetails) {
      console.error("No contract found to accept");
      return;
    }

    if (loggedInUsername === farmerUsername) {
      // Update the contract status to accepted
      const updatedContract = {
        ...contractDetails,
        contract_status: "accepted",
      };

      // Save updated contract to localStorage using the farmer's username as key
      localStorage.setItem(contractKey, JSON.stringify(updatedContract));

      // Update the contract status in state to reflect the change
      setContractStatus("accepted");
      setContract(updatedContract);

      // Log the updated contract and notify the user
      alert("Contract accepted!");
    } else {
      console.error("Logged-in username doesn't match farmer's username");
    }
  };

  const handleReject = () => {
    const loggedInUsername = localStorage.getItem("username"); // Get logged in username
    const farmerUsername = localStorage.getItem("farmer_username"); // Get farmer's username
    const contractKey = "contract_" + farmerUsername; // Construct the key for the contract in localStorage

    const contractDetails = JSON.parse(localStorage.getItem(contractKey)); // Fetch contract details from localStorage

    if (!contractDetails) {
      console.error("No contract found to reject");
      return;
    }

    if (loggedInUsername === farmerUsername) {
      // Update the contract status to rejected
      const updatedContract = {
        ...contractDetails,
        contract_status: "rejected",
      };

      // Save updated contract to localStorage using the farmer's username as key
      localStorage.setItem(contractKey, JSON.stringify(updatedContract));

      // Update the contract status in state to reflect the change
      setContractStatus("rejected");
      setContract(updatedContract);

      // Log the updated contract and notify the user
      alert("Contract rejected!");
    } else {
      console.error("Logged-in username doesn't match farmer's username");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-center p-6 space-y-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Contract Farming Agreement
        </h1>

        {/* Check if the farmer is part of the contract */}
        {!isValidContract ? (
          <p className="text-red-500">No Contracts</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Contract Preview
            </h2>
            <p>
              <strong>Buyer:</strong> {buyerName || "N/A"}
            </p>
            <p>
              <strong>Farmer:</strong> {farmerName || "N/A"}
            </p>
            <p>
              <strong>Crop:</strong> {cropName || "N/A"}
            </p>
            <p>
              <strong>Quantity:</strong> {contract?.crop_quantity || "N/A"} kg
            </p>
            <p>
              <strong>Price:</strong> ₹{contract?.price || "N/A"} per kg
            </p>
            <p>
              <strong>Duration:</strong> {contract?.duration || "N/A"} months
            </p>
            {contract?.additional_terms && (
              <p>
                <strong>Additional Terms:</strong> {contract?.additional_terms}
              </p>
            )}
            <p>
              This agreement is entered into between{" "}
              <strong>{buyerName}</strong> and <strong>{farmerName}</strong>.
              Both parties agree to the terms mentioned above to establish a
              successful contract farming relationship.
            </p>

            {/* Conditional rendering based on contract status */}
            {contractStatus === "accepted" ? (
              <p className="text-green-600 border-l-4 border-green-600 pl-4">
                You accepted this contract!
              </p>
            ) : contractStatus === "rejected" ? (
              <p className="text-red-600 border-l-4 border-red-600 pl-4">
                You rejected this contract!
              </p>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={handleAccept}
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ContractFarmer;
