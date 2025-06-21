import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import HowItWorksCard from "./HowItWorksCard";

const steps = [
  {
    title: "Booking Pick & Drop",
    description: "From personal packages to business shipments — we deliver on time, every time.",
    icon: CiDeliveryTruck
  },
  {
    title: "Cash On Delivery",
    description: "From personal packages to business shipments — we deliver on time, every time.",
    icon: CiDeliveryTruck
  },
  {
    title: "Delivery Hub",
    description: "From personal packages to business shipments — we deliver on time, every time.",
    icon: CiDeliveryTruck
  },
  {
    title: "Booking SME & Corporate",
    description: "From personal packages to business shipments — we deliver on time, every time.",
    icon: CiDeliveryTruck
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-teal-900 mb-8">How it Works</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <HowItWorksCard key={index} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
