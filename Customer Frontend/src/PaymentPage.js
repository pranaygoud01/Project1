
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";
// import CheckoutForm, { PaymentSuccessPage, PaymentFailedPage } from './components/CheckoutForm';


const stripePromise = loadStripe("pk_test_51PZvHB2K4MTGvwzuBKBrTOtMw5VRo4Hmg3QFHZK9FSWEb3ouIFNWJsXtPmpVZq88jsbeBX0fcisLbO3uTnlhbmgS00HNdfs1t4");

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    
    fetch("http://localhost:8080/api/payment/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // amount in paise (₹10)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.clientSecret,"client");
        setClientSecret(data.clientSecret);
      });
  }, []);

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div>
      <h2>Complete Payment</h2>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options} >
          <CheckoutForm clientSecret={options.clientSecret} amount="25.99" 
    orderId="123456" />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
