import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};



const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [serviceCentersData, setServiceCentersData] = useState([]);
  const [filteredSenderDistricts, setFilteredSenderDistricts] = useState([]);
  const [filteredReceiverDistricts, setFilteredReceiverDistricts] = useState(
    []
  );

  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");
  const parcelType = watch("type");

  useEffect(() => {
    fetch("/serviceCenter.json")
      .then((res) => res.json())
      .then((data) => setServiceCentersData(data))
      .catch((err) => console.error("Failed to load service centers:", err));
  }, []);

  // Filter sender districts
  useEffect(() => {
    if (senderRegion) {
      const centers = serviceCentersData.filter(
        (center) => center.region === senderRegion
      );
      const districts = [...new Set(centers.map((center) => center.district))];
      setFilteredSenderDistricts(districts);
    } else {
      setFilteredSenderDistricts([]);
    }
  }, [senderRegion, serviceCentersData]);

  // Filter receiver districts
  useEffect(() => {
    if (receiverRegion) {
      const centers = serviceCentersData.filter(
        (center) => center.region === receiverRegion
      );
      const districts = [...new Set(centers.map((center) => center.district))];
      setFilteredReceiverDistricts(districts);
    } else {
      setFilteredReceiverDistricts([]);
    }
  }, [receiverRegion, serviceCentersData]);

  const calculateCost = (type, weight, senderDistrict, receiverDistrict) => {
    const isSameDistrict = senderDistrict === receiverDistrict;
    const parsedWeight = parseFloat(weight) || 0;

    if (type === "document") {
      const cost = isSameDistrict ? 60 : 80;
      return {
        total: cost,
        breakdown: [
          { label: "Base cost (Document)", amount: cost },
          { label: "Same district?", amount: cost },
        ],
      };
    }

    if (type === "non-document") {
      if (parsedWeight <= 3) {
        const cost = isSameDistrict ? 110 : 150;
        return {
          total: cost,
          breakdown: [
            {
              label: "Base cost (Non-document, ≤ 3kg)",
              amount: cost,
            },
            { label: "Same district?", amount: cost },
          ],
        };
      } else {
        const extraWeight = parsedWeight - 3;
        const extraWeightCost = extraWeight * 40;
        const baseCost = isSameDistrict ? 110 : 150;
        const cost = isSameDistrict
          ? baseCost + extraWeightCost
          : baseCost + extraWeightCost + 40;

        return {
          total: cost,
          breakdown: [
            { label: "Base cost (first 3kg)", amount: baseCost },
            {
              label: `Extra weight (${extraWeight} kg × 40)`,
              amount: extraWeightCost,
            },
            !isSameDistrict && {
              label: "Out-of-district surcharge",
              amount: 40,
            },
          ].filter(Boolean),
        };
      }
    }

    return { total: 0, breakdown: [] };
  };

  const onSubmit = async (data) => {
    const { total: cost, breakdown } = calculateCost(
      data.type,
      data.weight,
      data.sender_district,
      data.receiver_district
    );

    const breakdownHtml = breakdown
      .map(
        (item) =>
          `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>${item.label}</span>
          <strong>৳${item.amount}</strong>
        </div>`
      )
      .join("");

    const result = await Swal.fire({
      title: `Delivery Cost: ৳${cost}`,
      html: `<div style="text-align:left; margin-top:10px;">${breakdownHtml}</div><br>Do you want to confirm this parcel?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "<span>💳 Proceed to Payment</span>",
      cancelButtonText: "<span>✏️ Keep Editing</span>",
    });

    if (result.isConfirmed) {
      const parcelWithDate = {
        ...data,
        cost,
        created_by: user?.email || "unknown",
        payment_status: "unpaid",
        delivery_status: "not_collected",
        creation_date: new Date().toISOString(),
        tracking_id: generateTrackingID(),
      };

      axiosSecure.post("/parcels", parcelWithDate).then((res) => {
        console.log("Server response:", res.data);
        if (res.data.insertedId) {
          Swal.fire({
            title: "Redirecting...",
            text: "Redirecting to the payment gateway...",
            icon: "info",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            // TODP:
            // Replace with your payment route or logic
            navigate('/dashboard/myparcels');
          });
        }
        reset();
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-md my-10">
      <h2 className="text-2xl font-bold mb-2">Add Parcel</h2>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details to book your parcel.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold">Parcel Info</h3>

          <div>
            <label className="label">Parcel Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="document"
                  {...register("type", { required: true })}
                  className="radio"
                />
                Document
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="non-document"
                  {...register("type", { required: true })}
                  className="radio"
                />
                Non-Document
              </label>
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm">Type is required</p>
            )}
          </div>

          <div>
            <label className="label">Parcel Name</label>
            <input
              {...register("title", { required: true })}
              className="input input-bordered w-full"
              placeholder="Describe your parcel"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Title is required</p>
            )}
          </div>

          {parcelType === "non-document" && (
            <div>
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("weight")}
                className="input input-bordered w-full"
                placeholder="Weight (optional)"
              />
            </div>
          )}
        </div>

        {/* Sender Info */}
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold">Sender Info</h3>

          <input
            {...register("sender_name", { required: true })}
            className="input input-bordered w-full"
            placeholder="Name"
          />
          <input
            {...register("sender_contact", { required: true })}
            className="input input-bordered w-full"
            placeholder="Contact"
          />

          <select
            {...register("sender_region", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Region</option>
            {[...new Set(serviceCentersData.map((c) => c.region))].map(
              (region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              )
            )}
          </select>

          <select
            {...register("sender_district", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {filteredSenderDistricts.map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>

          <input
            {...register("sender_address", { required: true })}
            className="input input-bordered w-full"
            placeholder="Address"
          />
          <textarea
            {...register("pickup_instruction", { required: true })}
            className="textarea textarea-bordered w-full"
            placeholder="Pickup Instruction"
          />
        </div>

        {/* Receiver Info */}
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold">Receiver Info</h3>

          <input
            {...register("receiver_name", { required: true })}
            className="input input-bordered w-full"
            placeholder="Name"
          />
          <input
            {...register("receiver_contact", { required: true })}
            className="input input-bordered w-full"
            placeholder="Contact"
          />

          <select
            {...register("receiver_region", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Region</option>
            {[...new Set(serviceCentersData.map((c) => c.region))].map(
              (region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              )
            )}
          </select>

          <select
            {...register("receiver_district", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {filteredReceiverDistricts.map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>

          <input
            {...register("receiver_address", { required: true })}
            className="input input-bordered w-full"
            placeholder="Address"
          />
          <textarea
            {...register("delivery_instruction", { required: true })}
            className="textarea textarea-bordered w-full"
            placeholder="Delivery Instruction"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Submit Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
