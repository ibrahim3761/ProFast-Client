import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

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
        title: "Card Accepted",
        text: "Card has been verified successfully.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center gap-2">
          <span>💳</span> Card Payment
        </h2>
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
          </div>
          <button
            type="submit"
            disabled={!stripe}
            className="btn btn-primary w-full py-3 text-lg"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
