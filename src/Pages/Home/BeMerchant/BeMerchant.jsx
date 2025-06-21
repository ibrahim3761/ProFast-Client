import React from "react";
import location from "../../../assets/location-merchant.png";
import merchantBg from "../../../assets/be-a-merchant-bg.png";

const BeMerchant = () => {
  return (
    <div data-aos="zoom-in-up" className="px-4 md:px-12 py-12  ">
      <div
        className="hero bg-[#03373D] md:p-20 rounded-4xl"
        style={{
          backgroundImage: `url(${merchantBg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          
        }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse ">
          <img src={location} className=" rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-xl md:text-5xl text-white font-bold">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>
            <p className="py-6 text-[#DADADA]">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button className="btn btn-primary bg-[#03373D] hover:bg-[#CAEB66] hover:text-[#1F1F1F] font-bold border-[#CAEB66] text-[#CAEB66] rounded-4xl">
                Become a Merchant
              </button>
              <button className="btn btn-primary bg-[#03373D] hover:bg-[#CAEB66] hover:text-[#1F1F1F] font-bold border-[#CAEB66] text-[#CAEB66] rounded-4xl">
                Earn with Profast Courier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
