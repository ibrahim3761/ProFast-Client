import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const { user } = useAuth();
  const logTracking = useTrackingLogger();

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["unassigned-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      return res.data;
    },
  });

  const handleAssignClick = async (parcel) => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    console.log("Assigning for district:", parcel.sender_district);
    try {
      const res = await axiosSecure.get(
        `/riders/active?district=${parcel.sender_district}`
      );
      setRiders(res.data);
    } catch (error) {
      console.error("Failed to load riders:", error);
      setRiders([]);
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleAssignConfirm = async (rider) => {
    try {
      await axiosSecure.patch(`/parcels/${selectedParcel._id}/assign`, {
        riderId: rider._id,
        riderEmail: rider.email,
        riderName: rider.name,
      });

      // ✅ Log tracking
      await logTracking({
        tracking_id: selectedParcel.tracking_id,
        status: "Rider Assigned",
        details: `Rider ${rider.name} has been assigned`,
        location: selectedParcel.sender_district,
        updated_by: user?.email || "admin",
      });
      Swal.fire("Success", "Rider assigned successfully", "success");
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  const closeModal = () => {
    setSelectedParcel(null);
    setRiders([]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>

      {isLoading && <p>Loading parcels...</p>}
      {isError && <p className="text-red-500">Failed to load parcels</p>}

      {!isLoading && parcels.length === 0 && (
        <p className="text-gray-500">
          No parcels available for rider assignment.
        </p>
      )}

      {parcels.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Sender Center</th>
                <th>Receiver Center</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.sender_district}</td>
                  <td>{parcel.receiver_district}</td>
                  <td>${parcel.cost}</td>
                  <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                  <td className="text-yellow-600 font-medium">Not Collected</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssignClick(parcel)}
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">
              Assign Rider for: {selectedParcel.tracking_id}
            </h3>

            {loadingRiders ? (
              <p>Loading riders...</p>
            ) : riders.length === 0 ? (
              <p>No riders found in {selectedParcel.service_district}.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {riders.map((rider) => (
                  <li
                    key={rider._id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-semibold">{rider.name}</p>
                      <p className="text-sm text-gray-500">{rider.district}</p>
                    </div>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAssignConfirm(rider)}
                    >
                      Confirm Assignment
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
