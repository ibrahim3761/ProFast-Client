import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaMoneyBill, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  const handleView = (parcel) => {
    Swal.fire({
      title: `<strong>Tracking ID: ${parcel.tracking_id}</strong>`,
      html: `
        <div style="text-align: left">
          <p><strong>Type:</strong> ${parcel.type}</p>
          <p><strong>Title:</strong> ${parcel.title}</p>
          <p><strong>Sender:</strong> ${parcel.sender_name} (${parcel.sender_contact})</p>
          <p><strong>Receiver:</strong> ${parcel.receiver_name} (${parcel.receiver_contact})</p>
          <p><strong>From:</strong> ${parcel.sender_district}, ${parcel.sender_region}</p>
          <p><strong>To:</strong> ${parcel.receiver_district}, ${parcel.receiver_region}</p>
          <p><strong>Cost:</strong> ৳${parcel.cost}</p>
          <p><strong>Status:</strong> ${parcel.delivery_status}</p>
          <p><strong>Created At:</strong> ${formatDate(parcel.creation_date)}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const handlePay = (parcel) => {
    Swal.fire({
      title: "Redirecting to Payment Gateway",
      text: `Pay ৳${parcel.cost} for parcel ${parcel.tracking_id}`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      console.log(`Redirecting for parcel ID: ${parcel._id}`);
      // navigate(`/payment/${parcel._id}`);
    }, 2000);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/parcels/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Parcel has been deleted.", "success");
            refetch();
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="w-full px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">📦 My Parcels</h2>

      <div className="overflow-x-auto rounded-lg shadow border bg-white">
        <table className="table table-zebra w-full min-w-[1000px]">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 capitalize">{parcel.type}</td>
                <td className="px-6 py-4 truncate">{parcel.title}</td>
                <td className="px-6 py-4">{formatDate(parcel.creation_date)}</td>
                <td className="px-6 py-4">৳{parcel.cost}</td>
                <td className="px-6 py-4">
                  <span
                    className={`badge ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleView(parcel)}
                    className="btn btn-xs btn-info text-white"
                    title="View"
                  >
                    <FaEye />
                  </button>
                  {parcel.payment_status === "unpaid" && (
                    <button
                      onClick={() => handlePay(parcel)}
                      className="btn btn-xs btn-success text-white"
                      title="Pay"
                    >
                      <FaMoneyBill />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-xs btn-error text-white"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {parcels.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No parcels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
