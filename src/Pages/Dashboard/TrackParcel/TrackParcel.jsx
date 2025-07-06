import React, { useEffect, useState } from "react";

import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const TrackParcel = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
    console.log(user.email);
    
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    axiosSecure
      .get(`/parcels/user/${user.email}`)
      .then((res) => {
        setParcels(res.data);
        setError("");
      })
      .catch(() => setError("Failed to load parcels."))
      .finally(() => setLoading(false));
  }, [user, axiosSecure]);

  if (!user) {
    return <p>Please log in to view your parcels.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-md my-10">
      <h2 className="text-2xl font-bold mb-6">Your Parcels & Tracking Status</h2>

      {loading && <p>Loading parcels...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && parcels.length === 0 && (
        <p>You have no parcels to track.</p>
      )}

      {!loading && !error && parcels.length > 0 && (
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Tracking ID</th>
              <th className="border border-gray-300 p-2">Parcel Name</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Last Update</th>
              <th className="border border-gray-300 p-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="border border-gray-300 p-2">{parcel.tracking_id}</td>
                <td className="border border-gray-300 p-2">{parcel.title}</td>
                <td className="border border-gray-300 p-2">
                  {parcel.latestTracking?.status || "No updates"}
                </td>
                <td className="border border-gray-300 p-2">
                  {parcel.latestTracking
                    ? new Date(parcel.latestTracking.timestamp).toLocaleString()
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {parcel.latestTracking?.location || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackParcel;
