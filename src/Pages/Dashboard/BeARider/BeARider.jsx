import React, { useEffect, useState } from "react";
import riderimage from "../../../assets/agent-pending.png";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth.JSX";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [serviceCentersData, setServiceCentersData] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);

  const selectedRegion = watch("region");

  useEffect(() => {
    fetch("/serviceCenter.json")
      .then((res) => res.json())
      .then((data) => setServiceCentersData(data));
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const warehouses = serviceCentersData
        .filter((center) => center.region === selectedRegion)
        .map((center) => center.city);
      setFilteredWarehouses([...new Set(warehouses)]);
    } else {
      setFilteredWarehouses([]);
    }
  }, [selectedRegion, serviceCentersData]);

  const onSubmit = (data) => {
    console.log("Rider Data:", data);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Your form is submitted.",
      confirmButtonText: "OK",
    });

    // You can add your backend submission here if needed
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center px-4 md:px-6 py-8">
      <div className="bg-white rounded-3xl shadow-md w-full flex flex-col md:flex-row p-8 gap-8 items-center">
        {/* Left - Form Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">Be a Rider</h2>
            <p className="text-gray-600 mt-2">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>
          </div>

          <hr className="my-4 border-gray-300" />

          <h3 className="text-xl font-semibold text-gray-800">
            Tell us about yourself
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                {...register("name")}
                defaultValue={user?.displayName}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
              <input
                type="email"
                {...register("email")}
                defaultValue={user?.email}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
              <input
                type="number"
                {...register("age", { required: true })}
                placeholder="Your Age"
                className="input input-bordered w-full"
              />
              <select
                {...register("region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select your region</option>
                {[...new Set(serviceCentersData.map((c) => c.region))].map(
                  (region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  )
                )}
              </select>
              <input
                type="text"
                {...register("nid", { required: true })}
                placeholder="NID"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                {...register("contact", { required: true })}
                placeholder="Contact"
                className="input input-bordered w-full"
              />
              <select
                {...register("warehouse", { required: true })}
                className="select select-bordered w-full md:col-span-2"
                disabled={!selectedRegion}
              >
                <option value="">
                  {selectedRegion ? "Select warehouse" : "Select region first"}
                </option>
                {filteredWarehouses.map((warehouse, index) => (
                  <option key={index} value={warehouse}>
                    {warehouse}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn bg-lime-400 text-white w-full mt-2 hover:bg-lime-500"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right - Image */}
        <div className="w-full md:w-1/2">
          <img
            src={riderimage}
            alt="Be a Rider"
            className="w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
