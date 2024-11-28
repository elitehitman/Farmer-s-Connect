import ContractBuyer from "./ContractBuyer";
import ContractFarmer from "./ContractFarmer";

const Contract = () => {
  let role = localStorage.getItem("role");
  return <div>{role == "buyer" ? <ContractBuyer /> : <ContractFarmer />}</div>;
};

export default Contract;
