import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

const calculateEarning = (parcel) => {
  const isSameDistrict =
    parcel.sender_district.toLowerCase() ===
    parcel.receiver_district.toLowerCase();
  const rate = isSameDistrict ? 0.8 : 0.3;
  return parcel.cost * rate;
};

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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

  const now = dayjs();
  const startOfWeek = now.startOf("week");
  const startOfMonth = now.startOf("month");
  const startOfYear = now.startOf("year");

  const stats = {
    total: 0,
    cashedOut: 0,
    pending: 0,
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  };

  parcels.forEach((parcel) => {
    const earned = calculateEarning(parcel);
    const deliveredAt = parcel.delivered_at ? dayjs(parcel.delivered_at) : null;

    stats.total += earned;

    if (parcel.cashed_out_status === "cashed_out") {
      stats.cashedOut += earned;
    } else {
      stats.pending += earned;
    }

    if (deliveredAt?.isToday()) stats.today += earned;
    if (deliveredAt?.isSameOrAfter(startOfWeek)) stats.week += earned;
    if (deliveredAt?.isSameOrAfter(startOfMonth)) stats.month += earned;
    if (deliveredAt?.isSameOrAfter(startOfYear)) stats.year += earned;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Earnings</h2>

      {isLoading ? (
        <p>Loading earnings...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EarningCard label="Total Earnings" amount={stats.total} color="green" />
          <EarningCard label="Cashed Out" amount={stats.cashedOut} color="blue" />
          <EarningCard label="Pending Cashout" amount={stats.pending} color="amber" />
          <EarningCard label="Today" amount={stats.today} color="purple" />
          <EarningCard label="This Week" amount={stats.week} color="pink" />
          <EarningCard label="This Month" amount={stats.month} color="indigo" />
          <EarningCard label="This Year" amount={stats.year} color="cyan" />
        </div>
      )}
    </div>
  );
};


const EarningCard = ({ label, amount, color }) => (
  <div className={`bg-${color}-100 p-4 rounded-lg shadow-md`}>
    <h3 className="text-lg font-semibold">{label}</h3>
    <p className="text-2xl font-bold text-${color}-700">৳ {amount.toFixed(2)}</p>
  </div>
);

export default MyEarnings;
