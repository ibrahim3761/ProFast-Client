import React from "react";

import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({
    tracking_id,
    status,
    details,
    location,
    updated_by,
  }) => {
    if (!tracking_id || !status) return;

    try {
      await axiosSecure.post("/trackings", {
        tracking_id,
        status,
        details,
        location,
        updated_by,
        timestamp: new Date(), // Optional: can be added server-side
      });
    } catch (error) {
      console.error("Failed to log tracking event:", error);
    }
  };

  return logTracking;
};

export default useTrackingLogger;
