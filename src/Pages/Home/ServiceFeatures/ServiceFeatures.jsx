import React from "react";
import liveParcelTrackingImg from "../../../assets/Illustrations/Illustration1.png";
import safeDeliveryImg from "../../../../src/assets/Illustrations/Illustration2.png";
import callCenterSupportImg from "../../../../src/assets/Illustrations/Illustration2.png";

const ServiceFeatures = () => {
  const features = [
    {
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
      image: liveParcelTrackingImg,
    },
    {
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      image: safeDeliveryImg,
    },
    {
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
      image: callCenterSupportImg,
    },
  ];

  return (
    <div className="px-4 md:px-12 py-12 bg-base-200 rounded-lg space-y-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center bg-base-100 p-6 rounded-xl shadow-md space-y-4 md:space-y-0 md:space-x-6"
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="w-32 h-32 object-contain"
          />
          {/* Dashed Divider */}
          <div className="hidden md:block h-24 border-l border-dashed border-neutral/40"></div>

          <div>
            <h3 className="text-xl font-extrabold text-[#03373D">
              {feature.title}
            </h3>
            <p className="text-[#606060] text-xl mt-2">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceFeatures;
