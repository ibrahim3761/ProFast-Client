import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const { user } = useAuth();
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()

  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const amount = parcelInfo.cost;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    // validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: error.message,
      });
    } else {
      setCardError("");
      console.log("paymentMethod", paymentMethod);
      Swal.fire({
        icon: "success",
        title: "Card Verified",
        text: "Your card has been verified successfully!",
      });
      // create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;
      // confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });
      if (result.error) {
        setCardError(result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        setCardError("");
        console.log("Payment succeeded!");
        console.log(result.paymentIntent.payment_method_types);
        //mark parcel paid also create payment history
        const paymentData = {
          parcelId,
          email: user.email,
          amount,
          transactionId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
      <p>Your transaction ID:</p>
      <code>${result.paymentIntent.id}</code>
    `,
            showConfirmButton: false,
            timer: 3000, // auto-dismiss after 3 seconds
            timerProgressBar: true,
            toast: true,
            position: "top-end",
          });

          navigate("/dashboard/myparcels"); // 👈 Immediately redirect
        } else {
          Swal.fire({
            icon: "error",
            title: "Payment Error",
            text: "You payment was not successful",
          });
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center gap-2">
          <span>💳</span> Card Payment
        </h2>
        <p className="text-lg text-center mb-4">
          Pay for Parcel:{" "}
          <span className="font-medium">{parcelInfo?.tracking_id}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 border-2 border-gray-300 rounded-xl">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "18px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                  },
                },
              }}
            />
            {cardError && (
              <p className="mt-4 text-red-500 text-sm font-medium">
                {cardError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!stripe}
            className="btn btn-primary w-full py-3 text-lg"
          >
            Pay ${amount}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
