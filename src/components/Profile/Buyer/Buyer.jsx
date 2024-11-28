/* eslint-disable react/prop-types */
import BuyerForm from "./BuyerForm";

const Buyer = (props) => {
  const fetchData = (params) => {};

  return (
    <>
      <div>
        <section className="relative bg-green-600 h-screen flex items-center justify-center">
          <BuyerForm isOpen={props.isOpen} />
        </section>
      </div>
    </>
  );
};

export default Buyer;
