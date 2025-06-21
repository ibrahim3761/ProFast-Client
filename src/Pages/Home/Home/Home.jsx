import React from "react";
import Banner from "../Banner/Banner";
import OurServices from "../Services/OurServices";
import HowItWorks from "../HowItWorks/HowItWorks";
import ClientLogos from "../ClientLogos/ClientLogos";
import ServiceFeatures from "../ServiceFeatures/ServiceFeatures";

const Home = () => {
  return (
    <div>
      <div className="px-2 md:px-6">
        <Banner></Banner>
      </div>
      <div className="px-2 md:px-6">
        <HowItWorks></HowItWorks>
      </div>
      <div className="px-2 md:px-6">
        <OurServices></OurServices>
      </div>
      <div>
        <ClientLogos></ClientLogos>
      </div>
      <div className="px-2 md:px-8">
        <ServiceFeatures></ServiceFeatures>
      </div>
    </div>
  );
};

export default Home;
