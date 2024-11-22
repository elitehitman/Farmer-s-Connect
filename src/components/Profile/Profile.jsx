import Buyer from "./Buyer/Buyer";
import Farmer from "./Farmer/Farmer";

const Profile = () => {
  let role = localStorage.getItem("role");
  return <div>{role == "buyer" ? <Buyer /> : <Farmer />}</div>;
};

export default Profile;
