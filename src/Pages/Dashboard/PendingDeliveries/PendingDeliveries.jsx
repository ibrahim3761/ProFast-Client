import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const logTracking = useTrackingLogger();
  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["rider-pending-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ parcelId, newStatus }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        status: newStatus,
      });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire("Success", data.message, "success");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update parcel status", "error");
    },
  });

  const handleStatusChange = (parcel, newStatus) => {
    const actionLabel =
      newStatus === "in_transit" ? "mark as Picked Up" : "mark as Delivered";

    Swal.fire({
      title: `Confirm ${actionLabel}?`,
      text: `Are you sure you want to ${actionLabel.toLowerCase()} this parcel?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(
          { parcelId: parcel._id, newStatus },
          {
            onSuccess: async () => {
              const statusLabel =
                newStatus === "in_transit" ? "Picked Up" : "Delivered";

              const location =
                newStatus === "in_transit"
                  ? parcel.sender_district
                  : parcel.receiver_district;

              await logTracking({
                tracking_id: parcel.tracking_id,
                status: `Parcel ${statusLabel}`,
                details: `Parcel was marked as ${statusLabel.toLowerCase()} by rider`,
                location: location || "Unknown",
                updated_by: user?.email || "rider",
              });

              Swal.fire(
                "Success",
                `Parcel marked as ${statusLabel}`,
                "success"
              );
              refetch();
            },
            onError: () => {
              Swal.fire("Error", "Failed to update parcel status", "error");
            },
          }
        );
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Deliveries</h2>

      {isLoading && <p>Loading pending deliveries...</p>}
      {isError && (
        <p className="text-red-500">Failed to load your assigned parcels.</p>
      )}

      {!isLoading && parcels.length === 0 && (
        <p className="text-gray-500">You have no pending deliveries.</p>
      )}

      {parcels.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Receiver</th>
                <th>Address</th>
                <th>Status</th>
                <th>Assigned At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>{parcel.receiver_address}</td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.delivery_status === "in_transit"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {parcel.delivery_status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {parcel.assigned_at
                      ? new Date(parcel.assigned_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        className="btn btn-sm btn-info"
                        disabled={mutation.isPending}
                        onClick={() =>
                          handleStatusChange(parcel, "in_transit")
                        }
                      >
                        {mutation.isPending
                          ? "Updating..."
                          : "Mark as Picked Up"}
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        className="btn btn-sm btn-success"
                        disabled={mutation.isPending}
                        onClick={() =>
                          handleStatusChange(parcel, "delivered")
                        }
                      >
                        {mutation.isPending
                          ? "Updating..."
                          : "Mark as Delivered"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
