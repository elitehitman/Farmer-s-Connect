import { useState, useEffect } from "react";
import Sidebar from "../General/Sidebar";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import logoImage from "../Data/Non-Judicial-Stamp-Paper1.jpg";

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

  const handleDownload = () => {
    const doc = new jsPDF();

    // Set the font
    doc.setFont("times", "normal");

    // Add a border to the page (all four sides)
    doc.rect(10, 10, 190, 277); // x, y, width, height

    // Contract Title - Make it bold and centered at the top
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("Contract Farming Agreement", 105, 20, null, null, "center");

    // Contract Information Section (with more professional formatting)
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Buyer: ${buyerName}`, 20, 40);
    doc.text(`Farmer: ${farmerName}`, 20, 50);
    doc.text(`Crop: ${cropName}`, 20, 60);
    doc.text(`Quantity: ${contract?.crop_quantity} kg`, 20, 70);
    doc.text(`Price: ₹${contract?.price} per kg`, 20, 80);
    doc.text(`Duration: ${contract?.duration} months`, 20, 90);

    // Add a line break for better spacing
    doc.line(10, 95, 200, 95); // Horizontal line for separation

    // Additional Terms Section (if provided)
    if (contract?.additional_terms) {
      doc.text(`Additional Terms:`, 20, 105);
      doc.text(`${contract?.additional_terms}`, 20, 115);
    }

    // Add a separator line before the mandatory compliance text
    doc.line(10, 135, 200, 135);

    // Add a professional "Mandatory Compliance" text section
    doc.setFont("times", "bold");
    doc.text("Mandatory Compliance", 20, 145);
    doc.setFont("times", "normal");
    doc.text(
      "This agreement is legally binding and subject to the terms and conditions outlined above.",
      20,
      155
    );
    doc.text(
      "Both parties are obligated to adhere to these terms throughout the contract period.",
      20,
      165
    );
    doc.text(
      "Failure to comply may result in legal actions as per the relevant laws of the land.",
      20,
      175
    );

    // Add a line for contract footer (below the compliance section)
    doc.line(10, 185, 200, 185);

    // Contract Footer with signature placeholders
    doc.text("_____________________", 20, 195); // Placeholder for buyer's signature
    doc.text("Buyer Signature", 20, 200);

    doc.text("_____________________", 140, 195); // Placeholder for farmer's signature
    doc.text("Farmer Signature", 140, 200);

    // Add Payment Image (stamp paper image)
    const image = new Image();
    image.src = logoImage; // Use logoImage here
    image.onload = () => {
      doc.addImage(image, "JPEG", 20, 210, 180, 40); // Position and size of the stamp image
      doc.save("contract-farming-agreement.pdf"); // Save PDF
    };
  };

  const paymentSuccess = localStorage.getItem("paymentSuccess");

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
              <>
                <p className="text-green-600 border-l-4 border-green-600 pl-4">
                  You accepted this contract!
                </p>
              </>
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
            {/* Displaying payment success image */}
            {paymentSuccess && (
              <div className="mt-4">
                <img
                  src={logoImage}
                  alt="Payment Image"
                  className="w-full h-auto"
                />
              </div>
            )}
            {paymentSuccess && (
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Download Updated Contract
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ContractFarmer;
