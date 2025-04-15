import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";


const CheckoutForm = ({ clientSecret, amount = "290.50", orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }
    
    setIsProcessing(true);
    
    const cardElement = elements.getElement(CardElement);
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          }
        },
      }
    );

    console.log("payment",paymentIntent);
    
    setIsProcessing(false);
    
    if (error) {
      // Navigate to failure page with error details
      navigate(`/payment/failed?message=${encodeURIComponent(error.message)}&orderId=${orderId}`);
    } else if (paymentIntent.status === "succeeded") {

      // Navigate to success page

      await fetch("http://localhost:8080/api/payment/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: paymentIntent.created,
          paymentMethodId: paymentIntent.payment_method,
          orderId: orderId, 
          userId: "123"
        }),
      });
      navigate(`/payment/success?orderId=${orderId}`);
    }
  };

  // Custom styles for the card element
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <motion.div 
      className="payment-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Payment Details</h2>
      
      <div className="payment-layout">
        <div className="card-preview">
          <motion.div 
            className="card-visual"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card-chip"></div>
            <div className="card-brand">VISA</div>
            <div className="card-number">4000 2331 5875 9123</div>
            <div className="card-details">
              <div className="card-expiry">12/19</div>
              <div className="card-name">{cardholderName || "CARDHOLDER NAME"}</div>
            </div>
          </motion.div>
        </div>
        
        <div className="payment-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name on Card</label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Jamie Jones"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Card Number</label>
              <div className="card-input-container">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
                {/* <img className="card-type-icon" src="https://cdn.cdnlogo.com/logos/v/69/visa.svg" alt="Visa" /> */}
              </div>
            </div>
            
            <motion.button 
              className="pay-button" 
              type="submit" 
              disabled={!stripe || !clientSecret || isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? (
                <div className="loading-spinner"></div>
              ) : (
                `PAY $ ${amount}`
              )}
            </motion.button>
            
            <div className="back-link">
              {/* <span>← Shipping Details</span> */}
            </div>
          </form>
        </div>
      </div>
      
      <style >{`
        .payment-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }
        
        h2 {
          text-align: center;
          color: #4a4a4a;
          margin-bottom: 30px;
          font-weight: 500;
        }
        
        .payment-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .card-preview {
          flex: 1;
          min-width: 300px;
        }
        
        .card-visual {
          background-color: #29477f;
          height: 200px;
          border-radius: 12px;
          padding: 20px;
          position: relative;
          color: white;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        
        .card-chip {
          width: 40px;
          height: 30px;
          background-color: #e6b354;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        
        .card-brand {
          position: absolute;
          right: 20px;
          top: 20px;
          font-size: 24px;
          font-weight: bold;
          color: white;
          letter-spacing: 1px;
        }
        
        .card-number {
          font-size: 18px;
          letter-spacing: 2px;
          margin-top: 10px;
          color: white;
        }
        
        .card-details {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        
        .card-name {
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .payment-form {
          flex: 1;
          min-width: 300px;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        label {
          display: block;
          color: #9a9a9a;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 16px;
          color: #4a4a4a;
          transition: border-color 0.3s;
        }
        
        input:focus {
          border-color: #29477f;
          outline: none;
        }
        
        .card-input-container {
          position: relative;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 12px;
          background-color: white;
          transition: border-color 0.3s;
        }
        
        .card-input-container:focus-within {
          border-color: #29477f;
        }
        
        .card-type-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          height: 20px;
          width: auto;
        }
        
        .pay-button {
          width: 100%;
          background-color: #29477f;
          color: white;
          border: none;
          padding: 16px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 15px;
          transition: background-color 0.2s;
          position: relative;
        }
        
        .pay-button:hover {
          background-color: #1e3665;
        }
        
        .pay-button:disabled {
          background-color: #a5a5a5;
          cursor: not-allowed;
        }
        
        .back-link {
          margin-top: 20px;
          color: #6a6a6a;
          cursor: pointer;
          font-size: 14px;
        }
        
        .back-link span:hover {
          text-decoration: underline;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .payment-layout {
            flex-direction: column;
          }
          
          .card-preview, .payment-form {
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

// Payment Success Page
const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Get order ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');
  
  // Trigger confetti effect on component mount
  React.useEffect(() => {
    // Launch confetti
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    // Launch multiple waves of confetti
    setTimeout(() => {
      launchConfetti();
      setTimeout(launchConfetti, 700);
      setTimeout(launchConfetti, 1400);
      setIsAnimated(true);
    }, 500);
  }, []);
  
  // Estimated delivery time (30 min from now)
  const deliveryTime = new Date();
  deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);
  const formattedTime = deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="success-page">
      <motion.div 
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeInOut" }}
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Payment Successful!
        </motion.h1>
        
        <motion.div 
          className="order-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="order-id">Order ID: #{orderId}</p>
          <div className="delivery-info">
            <div className="delivery-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Estimated Delivery: {formattedTime}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="delivery-animation"
          initial={{ x: "-100%" }}
          animate={{ x: isAnimated ? "100%" : "-100%" }}
          transition={{ delay: 1.5, duration: 3, ease: "easeInOut" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
            <polyline points="13 2 13 8 19 8"></polyline>
          </svg>
        </motion.div>
        
        <div className="buttons">
          <motion.button 
            className="track-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/track-order/${orderId}`)}
          >
            Track My Order
          </motion.button>
          
          <motion.button 
            className="home-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            Back to Menu
          </motion.button>
        </div>
      </motion.div>
      
      <style jsx>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          font-family: 'Arial', sans-serif;
          padding: 20px;
        }
        
        .success-container {
          background-color: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #4CAF50;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .success-icon svg {
          width: 40px;
          height: 40px;
        }
        
        h1 {
          color: #333;
          margin-bottom: 30px;
          font-weight: 600;
        }
        
        .order-details {
          margin-bottom: 40px;
        }
        
        .order-id {
          color: #666;
          font-size: 18px;
          margin-bottom: 15px;
        }
        
        .delivery-info {
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .delivery-time {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #555;
        }
        
        .delivery-time svg {
          color: #FF5722;
        }
        
        .delivery-animation {
          position: absolute;
          bottom: 100px;
          color: #FF5722;
          opacity: 0.8;
        }
        
        .buttons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .track-button, .home-button {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }
        
        .track-button {
          background-color: #FF5722;
          color: white;
        }
        
        .home-button {
          background-color: #EEE;
          color: #333;
        }
        
        @media (max-width: 500px) {
          .buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

// Payment Failed Page
const PaymentFailedPage = () => {
  const navigate = useNavigate();
  
  // Get error message and order ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const errorMessage = urlParams.get('message') || "An unknown error occurred";
  const orderId = urlParams.get('orderId');

  return (
    <div className="failed-page">
      <motion.div 
        className="failed-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="failed-icon"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeInOut" }}
              d="M6 18L18 6M6 6l12 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Payment Failed
        </motion.h1>
        
        <motion.div 
          className="error-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="error-message">{errorMessage}</p>
          <p className="order-id">Order ID: #{orderId}</p>
        </motion.div>
        
        <div className="buttons">
          <motion.button 
            className="retry-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/checkout/${orderId}`)}
          >
            Try Again
          </motion.button>
          
          <motion.button 
            className="support-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contact-support')}
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>
      
      <style jsx>{`
        .failed-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          font-family: 'Arial', sans-serif;
          padding: 20px;
        }
        
        .failed-container {
          background-color: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
        }
        
        .failed-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #F44336;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .failed-icon svg {
          width: 40px;
          height: 40px;
        }
        
        h1 {
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .error-details {
          margin-bottom: 30px;
        }
        
        .error-message {
          padding: 15px;
          background-color: #FFF8F7;
          border-left: 4px solid #F44336;
          text-align: left;
          color: #666;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .order-id {
          color: #666;
          font-size: 16px;
        }
        
        .buttons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .retry-button, .support-button {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }
        
        .retry-button {
          background-color: #29477f;
          color: white;
        }
        
        .support-button {
          background-color: #EEE;
          color: #333;
        }
        
        @media (max-width: 500px) {
          .buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

// Export all components
export { CheckoutForm, PaymentSuccessPage, PaymentFailedPage };
export default CheckoutForm;