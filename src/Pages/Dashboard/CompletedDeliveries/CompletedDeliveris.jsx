import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth"; // assuming it returns logged-in rider info
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completed-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/parcels/completed?email=${user.email}`
      );
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (parcelId) => {
      await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
    },
    onSuccess: () => {
      Swal.fire("Success", "Parcel cashed out successfully", "success");
      queryClient.invalidateQueries(["completed-parcels", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to cash out parcel", "error");
    },
  });

  const handleCashout = (id) => {
    mutation.mutate(id);
  };

  const calculateEarnings = (parcel) => {
    if (parcel.receiver_district === parcel.sender_district) {
      return parcel.cost * 0.8; // same district
    } else {
      return parcel.cost * 0.3; // different district
    }
  };

  const totalEarnings = parcels
    .filter((p) => p.cashed_out_status !== "cashed_out")
    .reduce((sum, p) => sum + calculateEarnings(p), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>

      {isLoading && <p>Loading...</p>}

      {parcels.length === 0 && (
        <p className="text-gray-500">No completed deliveries yet.</p>
      )}

      {parcels.length > 0 && (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="table w-full border">
              <thead>
                <tr className="bg-base-200">
                  <th>#</th>
                  <th>Tracking ID</th>
                  <th>Title</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Fee</th>
                  <th>Earning</th>
                  <th>Picked At</th>
                  <th>Delivered At</th>
                  <th>Status</th>
                  <th>Cashout</th>
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
                    <td>${calculateEarnings(parcel).toFixed(2)}</td>
                    <td>
                      {parcel.in_transit_at
                        ? new Date(parcel.in_transit_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {parcel.delivered_at
                        ? new Date(parcel.delivered_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="capitalize">{parcel.delivery_status}</td>
                    <td>
                      {parcel.cashed_out_status === "cashed_out" ? (
                        <span className="text-green-600 font-semibold">
                          Cashed Out
                        </span>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleCashout(parcel._id)}
                          disabled={mutation.isPending}
                        >
                          Cash Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right font-semibold">
            <p>Total Pending Earnings: ${totalEarnings.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CompletedDeliveries;
