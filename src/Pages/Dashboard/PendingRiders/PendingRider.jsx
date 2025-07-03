import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleView = (rider) => {
    setSelectedRider(rider);
    document.getElementById("riderModal").showModal();
  };

  const handleStatusChange = async (id, status,email) => {
    // Close the modal immediately
    const modal = document.getElementById("riderModal");
    modal.close();
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${status} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/${id}`, { status, email });
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            Swal.fire("Updated!", `Rider has been ${status}ted.`, "success");
            refetch();
          }, 150); // 100–150ms is typically enough
        });
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  if (isPending) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Rider Applications</h2>

      <div className="overflow-x-auto">
        <table className="table w-full bg-white border shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Applied On</th>
              <th>Region</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{new Date(rider.created_at).toLocaleString()}</td>
                <td>{rider.region || "N/A"}</td>
                <td>
                  <button
                    onClick={() => handleView(rider)}
                    className="btn btn-sm btn-info text-white"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {riders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No pending riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="riderModal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Rider Application Details</h3>
          {selectedRider && (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>Address:</strong> {selectedRider.address}
              </p>
              <p>
                <strong>Applied:</strong>{" "}
                {new Date(selectedRider.created_at).toLocaleString()}
              </p>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-success"
              onClick={() => handleStatusChange(selectedRider._id, "active",selectedRider.email)}
            >
              Accept
            </button>
            <button
              className="btn btn-error"
              onClick={() => handleStatusChange(selectedRider._id, "cancelled", selectedRider.email)}
            >
              Reject
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PendingRider;
