import React, { useState } from 'react';
import axios from "axios";
import "../../CSS/App.css";
import backimg from "../../Images/backimg.png";

const Payment = ({ order,amount, currency, locale, setview }) => {

  const [upiId, setUpiId] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCVC] = useState('');

  const [paymentmode, setpaymentmode] = useState('upi');

  const [totalAmount, setTotalAmount] = useState(amount);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleUpiPayment = async () => {
    setLoading(true);
    const upi = {
      upiId: upiId,
      totalAmount: totalAmount,
      currency: currency
    }

    try {
      // Make API request to backend to process UPI payment
      const response = await axios.post('http://localhost:8080/payment/upi/create', upi);
      setPaymentSuccess(true);
    } catch (error) {
      setError('UPI payment failed');
    }
    setLoading(false);
  };

  const handleCardPayment = async () => {
    setLoading(true);
    const card = {
      cardNumber: cardNumber,
      expiry: expiry,
      cvc: cvc,
      totalAmount: totalAmount,
      currency: currency
    }

    try {
      // Make API request to backend to process card payment
      const response = await axios.post('http://localhost:8080/payment/card/create', card);
      setPaymentSuccess(true);
    } catch (error) {
      setError('Card payment failed');
    }
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    if (paymentmode == "upi") {
      if (upiId && totalAmount) { handleUpiPayment(); } else { setError("Fill the required fields"); }
    } else if (paymentmode == "card") {
      if (cardNumber && expiry && cvc && totalAmount) { handleCardPayment(); } else { setError("Fill the required fields"); }
    } else {
      setError('Please fill in payment details');
    }
    setview('invoice');
  };

  const mode = () => {
    {
      if (paymentmode == 'card') {
        return <><div>
          <label className='form-label'>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            className='form-control'
            placeholder='Enter card number'
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
          <div>
            <label className='form-label'>Expiry:</label>
            <input
              type="text"
              value={expiry}
              className='form-control' placeholder='Expiry-date'
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
            <label className='form-label'>CVC:</label>
            <input
              type="text"
              className='form-control'
              placeholder='Enter CVC'
              value={cvc}
              onChange={(e) => setCVC(e.target.value)}
              required
            />
          </div>
        </>


      } else if (paymentmode == 'upi') {
        return <div>
          <label className='form-label'>UPI ID:</label>
          <input
            type="text"
            className='form-control'
            placeholder='Enter UPI ID'
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
        </div>
      } else {
        return <div>
          <h5>Your Order number is {order}.</h5>
          <p>Pay the bill at the counter</p>
        </div>
      }
    }
  }

  return (
    <div className="payment container shadow col-md-11 col-lg-8" style={{ textAlign: 'center' }}>
      <div className='mx-auto pb-5 mb-3' style={{ width: '100%' }}>
        <div className='d-flex'><img className='my-auto' src={backimg} height={35} width={35} onClick={() => setview('cart')} />
          <pre>  </pre>
          <h2 className='my-3'>Payment Information</h2></div>
        <h5>Total Amount : {locale} {totalAmount.toFixed(2)}</h5>
        <form onSubmit={handleSubmit} className=' col-md-11 col-lg-6' style={{ margin: 'auto' }}>
          <label className='form-label'>Mode of Payment</label>
          <select onChange={(e) => setpaymentmode(e.target.value)} className='form-control mb-3'>
            <option value='upi' defaultChecked>UPI ID</option>
            <option value='card'>Credit/Debit card</option><option value='cash'>Cash</option>
          </select>
          {mode()}
          <button type="submit" className='d-block mx-auto btn btn-warning mt-4'>Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
