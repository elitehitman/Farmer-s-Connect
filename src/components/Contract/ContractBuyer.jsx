import { useState, useEffect } from "react";
import Sidebar from "../General/Sidebar";
import axios from "axios";
import stampPaper from "../Data/Non-Judicial-Stamp-Paper1.jpg";
import { jsPDF } from "jspdf";

const ContractBuyer = () => {
  const [buyer, setBuyer] = useState(""); // Stores the buyer's username
  const [buyerName, setBuyerName] = useState(""); // Stores the buyer's name
  const [farmer, setFarmer] = useState(""); // Stores the farmer's username
  const [farmerName, setFarmerName] = useState(""); // Stores the farmer's name
  const [contract, setContract] = useState(null); // Stores the current contract
  const [preview, setPreview] = useState(false); // Toggles preview display
  const [paymentDetails, setPaymentDetails] = useState(""); // UPI ID for payment
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Simulates payment success

  // Customizable contract fields
  const [cropName, setCropName] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [additionalTerms, setAdditionalTerms] = useState("");

  // New state for contract status
  const [contractStatus, setContractStatus] = useState("pending");

  // Fetch buyer and farmer details from localStorage
  useEffect(() => {
    const buyerUsername = localStorage.getItem("username");
    const farmerUsername = localStorage.getItem("farmer_username");
    const farmerName = localStorage.getItem("farmer_name");

    if (buyerUsername) {
      setBuyer(buyerUsername);
      fetchBuyerName(buyerUsername); // Fetch buyer's name using their username
    }
    if (farmerUsername) setFarmer(farmerUsername);
    if (farmerName) setFarmerName(farmerName);

    // Check if there's an existing contract in localStorage for this buyer and farmer
    const contractKey = "contract_" + farmerUsername;
    const existingContract = JSON.parse(localStorage.getItem(contractKey));

    if (existingContract) {
      setContract(existingContract);
    }
    // Check if payment has been successfully completed from localStorage
    const paymentStatus = localStorage.getItem("paymentSuccess");
    if (paymentStatus === "true") {
      setPaymentSuccess(true);
    }
  }, []);

  // Fetch buyer's name from the backend using their username
  const fetchBuyerName = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getbuyername/${username}`
      );
      if (response.data.name) setBuyerName(response.data.name);
    } catch (error) {
      console.error("Error fetching buyer name:", error);
    }
  };

  const handlePreview = () => {
    const contractKey = "contract_" + farmer; // Consistent key based on the farmer's username

    const contractDetails = {
      buyer_username: buyer,
      buyer_name: buyerName,
      farmer_username: farmer,
      farmer_name: farmerName,
      crop_name: cropName,
      crop_quantity: cropQuantity,
      price: price,
      duration: duration,
      additional_terms: additionalTerms,
      contract_status: contractStatus,
    };

    // Storing contract in localStorage
    localStorage.setItem(contractKey, JSON.stringify(contractDetails));

    // Show the preview
    setPreview(true);
    setContract(contractDetails); // Update contract state with the new details
  };

  const handlePayment = async () => {
    try {
      setPaymentSuccess(true);
      // Store payment status in localStorage
      localStorage.setItem("paymentSuccess", "true");

      // Get the buyer's email from localStorage (assuming the email is stored under 'username')
      const buyerEmail = localStorage.getItem("username");

      // Send the email via an API call to the backend
      await axios.post("http://localhost:3000/send-payment-email", {
        email: buyerEmail,
        subject: "Payment Successful - Contract Farming",
        text: `
          Dear ${buyerName},
  
          Your payment for the contract farming agreement has been successfully processed. 
          The contract has been confirmed, and both parties (you and ${farmerName}) are now bound by the terms of the agreement.
  
          If you have any questions or concerns, feel free to reach out to us.
  
          Best regards,
          The Contract Farming Team
        `,
      });

      // Simulate email sending (logging to console for now)
      alert("Payment successful! An email has been sent to you.");

      // Add image to contract preview after successful payment
      const updatedContract = {
        ...contract,
        paymentImage: stampPaper,
      };
      setContract(updatedContract);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment. Please try again.");
    }
  };

  // Function to generate and download the PDF
  const generatePDF = () => {
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
    doc.text(`Crop: ${contract.crop_name}`, 20, 60);
    doc.text(`Quantity: ${contract.crop_quantity} kg`, 20, 70);
    doc.text(`Price: Rs.${contract.price} per kg`, 20, 80);
    doc.text(`Duration: ${contract.duration} months`, 20, 90);

    // Add a line break for better spacing
    doc.line(10, 95, 200, 95); // Horizontal line for separation

    // Additional Terms Section (if provided)
    if (contract.additional_terms) {
      doc.text(`Additional Terms:`, 20, 105);
      doc.text(`${contract.additional_terms}`, 20, 115);
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
    image.src = stampPaper;
    image.onload = () => {
      doc.addImage(image, "JPEG", 20, 210, 180, 40); // Position and size of the stamp image
      doc.save("contract-farming-agreement.pdf"); // Save PDF
    };
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-center p-6 space-y-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Contract Page
        </h1>
        {/* If payment is successful, show the download button */}
        {paymentSuccess && contract && (
          <button
            onClick={generatePDF}
            className="absolute top-4 right-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Download Contract PDF
          </button>
        )}
        {/* New Contract Button */}
        {paymentSuccess && (
          <button
            onClick={() => {
              localStorage.setItem("paymentSuccess", "false"); // Reset payment status
              setContract(null); // Clear the current contract details
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mt-4"
          >
            New Contract
          </button>
        )}
        {/* If there's an existing contract, show the contract preview */}
        {contract ? (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Contract Farming Agreement
            </h2>
            <p>
              <strong>Buyer:</strong> {buyerName || "N/A"}
            </p>
            <p>
              <strong>Farmer:</strong> {farmerName || "N/A"}
            </p>
            <p>
              <strong>Crop:</strong> {contract.crop_name || "N/A"}
            </p>
            <p>
              <strong>Quantity:</strong> {contract.crop_quantity || "N/A"} kg
            </p>
            <p>
              <strong>Price:</strong> Rs.{contract.price || "N/A"} per kg
            </p>
            <p>
              <strong>Duration:</strong> {contract.duration || "N/A"} months
            </p>
            {contract.additional_terms && (
              <p>
                <strong>Additional Terms:</strong> {contract.additional_terms}
              </p>
            )}
            <p>
              This agreement is entered into between{" "}
              <strong>{buyerName}</strong> and <strong>{farmerName}</strong>.
            </p>
            {contract.contract_status === "accepted" && (
              <div className="bg-green-500 text-white p-4 rounded-md">
                <span>{contract.farmer_name} Accepted Your Contract</span>
              </div>
            )}

            {/* Contract Status Button (Pending for now) */}
            {contract.contract_status === "accepted" && !paymentSuccess && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="upiId"
                    className="block text-gray-600 font-medium"
                  >
                    UPI ID:
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-gray-600 font-medium"
                  >
                    Amount:
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={100}
                    readOnly
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handlePayment}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Pay ₹100
                </button>
              </div>
            )}

            {/* Displaying payment success image */}
            {paymentSuccess && (
              <div className="mt-4">
                <img
                  src={stampPaper}
                  alt="Payment Image"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        ) : (
          // If no contract exists, show the contract creation form
          <form className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Contract Details
            </h2>
            {/* Contract creation form fields */}

            <div>
              <label
                htmlFor="cropName"
                className="block text-gray-600 font-medium"
              >
                Crop Name:
              </label>
              <input
                type="text"
                id="cropName"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="cropQuantity"
                className="block text-gray-600 font-medium"
              >
                Crop Quantity (e.g., in kg):
              </label>
              <input
                type="number"
                id="cropQuantity"
                value={cropQuantity}
                onChange={(e) => setCropQuantity(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-gray-600 font-medium"
              >
                Price per Unit (e.g., Rs/kg):
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-gray-600 font-medium"
              >
                Contract Duration (e.g., in months):
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="additionalTerms"
                className="block text-gray-600 font-medium"
              >
                Additional Terms (optional):
              </label>
              <textarea
                id="additionalTerms"
                value={additionalTerms}
                onChange={(e) => setAdditionalTerms(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ... */}
            <button
              type="button"
              onClick={handlePreview}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Preview Contract
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ContractBuyer;
