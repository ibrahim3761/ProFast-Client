import React from "react";

const ServiceCard = ({ service }) => {
    const {icon:Icon , title,description} = service
  return (
    <div className="bg-white rounded-lg p-6 shadow hover:bg-[#CAEB66] transition duration-300 ease-in-out">
      <div className="flex justify-center text-4xl text-amber-600 mb-4">
        <Icon />
      </div>
      <h3 className="text-lg font-bold text-black text-center mb-2">{title}</h3>
      <p className="text-sm text-center text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
