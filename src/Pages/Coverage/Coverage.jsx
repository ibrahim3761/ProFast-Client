import React, { useState } from "react";
import CoverageMap from "./CoverageMap";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const serviceCenters = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white m-2 md:m-6 rounded-3xl">
      <div className="px-4 md:px-10 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          We are available in 64 districts
        </h1>

        {/* Search box */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Search for a district..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <p className="text-lg font-bold mb-4 text-center">
          We deliver almost all over Bangladesh
        </p>

        <CoverageMap
          serviceCenters={serviceCenters}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default Coverage;
