import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  return (
    <div className="w-full px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">💳 Payment History</h2>

      <div className="overflow-x-auto rounded-lg shadow border bg-white">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Parcel ID</th>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{payment.email}</td>

                <td
                  className="px-6 py-4 max-w-[150px] truncate"
                  title={payment.parcelId}
                >
                  {payment.parcelId}
                </td>

                <td
                  className="px-6 py-4 max-w-[180px] truncate text-blue-600"
                  title={payment.transactionId}
                >
                  {payment.transactionId}
                </td>

                <td className="px-6 py-4">৳{payment.amount}</td>
                <td className="px-6 py-4 capitalize">
                  {Array.isArray(payment.paymentMethod)
                    ? payment.paymentMethod.join(", ")
                    : payment.paymentMethod}
                </td>
                <td className="px-6 py-4">{formatDate(payment.paid_at)}</td>
              </tr>
            ))}

            {payments.length === 0 && !isPending && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
