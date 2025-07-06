import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaUserClock,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const statusIcons = {
  delivered: <FaCheckCircle className="text-green-600 text-2xl" />,
  in_transit: <FaTruck className="text-blue-500 text-2xl" />,
  not_collected: <FaUserClock className="text-yellow-500 text-2xl" />,
  rider_assigned: <FaBox className="text-purple-600 text-2xl" />,
};

const COLORS = ["#16a34a", "#3b82f6", "#facc15", "#a855f7"]; // Tailwind color codes

const AdminDash = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: statusCounts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["parcel-status-counts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📦 Admin Parcel Dashboard</h2>

      {isLoading && <p>Loading status counts...</p>}
      {isError && <p className="text-red-500">Error: {error.message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {statusCounts.map((status) => (
          <div
            key={status.status}
            className="card shadow-md bg-base-100 border border-base-200"
          >
            <div className="card-body items-center text-center">
              {statusIcons[status.status] || (
                <FaBox className="text-gray-500 text-2xl" />
              )}
              <h3 className="text-lg font-bold capitalize mt-2">
                {status.status.replace(/_/g, " ")}
              </h3>
              <p className="text-3xl font-extrabold text-primary">
                {status.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      {statusCounts.length > 0 && (
        <div className="bg-base-100 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Parcel Status Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name.replace(/_/g, " ")} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDash;
