/* eslint-disable react/prop-types */
import FarmerForm from "./FarmerForm";

const Farmer = (props) => {
  const fetchData = (params) => {};

  return (
    <>
      <div>
        <section className="relative bg-green-600 h-screen flex items-center justify-center">
          <FarmerForm isOpen={props.isOpen} />
        </section>
      </div>
    </>
  );
};

export default Farmer;
