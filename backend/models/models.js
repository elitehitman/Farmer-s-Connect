import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    maxlength: 60,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },
});

const FarmerSchema = new Schema({
  username: {
    type: String,
    maxlength: 60,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "",
    maxlength: 100,
  },
  contact: {
    type: Number,
    maxlength: 10,
    minlength: 10,
  },
  location: {
    type: String,
    maxlength: 100,
  },
  experience: {
    type: String,
    maxlength: 2,
  },
  personalInfo: {
    type: String,
    maxlength: 200,
  },
  verification_status: {
    type: Boolean,
    default: false,
  },
  documents: [
    {
      title: {
        type: String,
        required: true, // Ensure title is provided
      },
      path: {
        type: String,
        required: true, // Ensure path is provided
      },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Rejected"], // Example status options
      },
    },
  ],
  profileImage: {
    type: String, // URL or path to the profile image
    default: "", // Default value can be an empty string or a placeholder image URL
  },
  farmImage1: {
    type: String, // URL or path to the first farm image
    default: "",
  },
  farmImage2: {
    type: String, // URL or path to the second farm image
    default: "",
  },
});

const BuyerSchema = new Schema({
  username: {
    type: String,
    maxlength: 60,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 100,
  },
  contact: {
    type: Number,
    maxlength: 10,
    minlength: 10,
  },
  location: {
    type: String,
    maxlength: 100,
  },
  verification_status: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    maxlength: 100,
  },
  company: {
    type: String,
    maxlength: 100,
  },
  profileImage: {
    type: String, // URL or path to the profile image
    default: "", // Default value can be an empty string or a placeholder image URL
  },
  companyImage1: {
    type: String, // URL or path to the first farm image
    default: "",
  },
  companyImage2: {
    type: String, // URL or path to the second farm image
    default: "",
  },
});

const User = model("User", UserSchema);
const Farmer = model("Farmer", FarmerSchema);
const Buyer = model("Buyer", BuyerSchema);

export { User, Farmer, Buyer };
