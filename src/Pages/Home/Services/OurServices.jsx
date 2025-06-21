import React from "react";
import ServiceCard from "./ServiceCard";
import {
  FaShippingFast,
  FaGlobeAmericas,
  FaBoxes,
  FaMoneyBillWave,
  FaBuilding,
  FaUndo
} from "react-icons/fa";

const services = [
  {
    icon: FaShippingFast,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off."
  },
  {
    icon: FaGlobeAmericas,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours."
  },
  {
    icon: FaBoxes,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support."
  },
  {
    icon: FaMoneyBillWave,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product."
  },
  {
    icon: FaBuilding,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support."
  },
  {
    icon: FaUndo,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants."
  }
];

const OurServices = () => {
  return (
    <section className="py-12 px-4 md:px-10 bg-[#03373D] text-white my-4 rounded-2xl">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
        <p className="mb-10 max-w-3xl mx-auto text-gray-300 text-sm">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
          From personal packages to business shipments — we deliver on time, every time.
        </p>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <ServiceCard
              key={idx}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
