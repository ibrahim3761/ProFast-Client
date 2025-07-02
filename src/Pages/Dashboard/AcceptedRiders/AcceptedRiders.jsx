import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRider = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const handleDeactivate = async (riderId) => {
    const confirm = await Swal.fire({
      title: "Deactivate Rider?",
      text: "Are you sure you want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/${riderId}`, { status: "deactivated" });

        Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
        refetch();
      } catch (err) {
        Swal.fire("Error", "Failed to deactivate rider.", "error");
      }
    }
  };

  const filteredRiders = riders.filter((rider) =>
  rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (rider.region && rider.region.toLowerCase().includes(searchTerm.toLowerCase()))
);


  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Active Riders</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name and region"
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="table w-full bg-white border">
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Region</th>
              <th>Address</th>
              <th>Joined On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.contact || "N/A"}</td>
                <td>{rider.region || "N/A"}</td>
                <td>{rider.address || "N/A"}</td>
                <td>{new Date(rider.created_at).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeactivate(rider._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}

            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No active riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRider;
