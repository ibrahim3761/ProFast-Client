import React from "react";

const HowItWorksCard = ({ step }) => {
    const { icon: Icon, title, description } = step;
  return (
    <div className="bg-white rounded-lg p-6 shadow text-center hover:shadow-md transition">
      <div className="flex justify-center text-3xl text-teal-900 mb-3">
        <Icon />
      </div>
      <h3 className="font-semibold text-teal-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default HowItWorksCard;
