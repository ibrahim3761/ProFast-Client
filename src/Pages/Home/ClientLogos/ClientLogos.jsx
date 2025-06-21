import React from "react";
import Marquee from "react-fast-marquee";

const logos = [
  "/src/assets/brands/casio.png",
  "/src/assets/brands/amazon.png",
  "/src/assets/brands/moonstar.png",
  "/src/assets/brands/start.png",
  "/src/assets/brands/start-people 1.png",
  "/src/assets/brands/randstad.png",
];

const ClientLogos = () => {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        We've helped thousands of sales teams
      </h2>
      <Marquee
        gradient={false}
        speed={40}
        pauseOnHover={false}
        direction="left"
      >
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`client-logo-${index}`}
            className="h-6 mx-24"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogos;
