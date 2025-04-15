// Cart.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../ContextAPI/userdata";
import axios from "axios";
import backimg from "../Images/backimg.png";
import "../CSS/App.css";
import { useContext } from "react";

const Cart = () => {
  const {  host,
    orderNo,
    today,
    contact,
    userId,
    option,
    localevalue,
    locale,
    currency,
    SGST,
    CGST,
    setCartCount} = useContext(AppContext)
  const [cart, setCart] = useState([]);
  const [amount, setAmount] = useState(0);
  const [view, setView] = useState("cart");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  //
  const [subTotal, setSubTotal] = useState(0);
  //
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");


  const navigate = useNavigate();

  const discountedAmount = amount - (discount / 100) * amount;
  const taxAmount = ((SGST + CGST) / 100) * discountedAmount;
  const totalAmount = discountedAmount + taxAmount;

  const order = {
    orderNo,
    date: today,
    amount: discountedAmount,
    contact,
    mode: option,
    sgst: SGST,
    cgst: CGST,
    totalAmount,
    paymentMode:paymentMethod,
    orderAccept: false,
    cart,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      const response = await axios.get(`${host}/cart/active/customer/${customerId}`);

      console.log("Cart API response:", response.data);

      const cartData = response.data; // ✅ Define it first

      if (cartData && cartData.items && cartData.items.length > 0) {
        setCart(cartData.items);
        setAmount(cartData.grandTotal);
        setSubTotal(cartData.subTotal); // ✅ Set it from backend
        setCartCount(cartData.items.length);
      } else {
        // Empty cart
        setCart([]);
        setAmount(0);
        setCartCount(0);
      }
    } catch (error) {
      // If cart is deleted (e.g., 404 or 500), clear cart state gracefully
      console.log("Cart not found or deleted:", error.message);
      setCart([]);
      setAmount(0);
      setCartCount(0);
    }
  };

  const postdata = async () => {
    await axios.post(`${host}/orders`, order);
  };

  const deleteProduct = async (cartItemId) => {
    try {
      await axios.delete(`${host}/cart/items/delete/${cartItemId}`);
      fetchData();
    } catch {
      console.log("error while deleting item from cart");
    }
  };

  const sum = (cart) =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);
  /*
  const updateQuantity = async (productId, cartId, newQuantity) => {
    const product = cart.find((item) => item.sku === productId);
    if (product) {
      const updatedProduct = { ...product, quantity: newQuantity };
      await axios.put(`${host}/cart/${cartId}`, updatedProduct);
      fetchData();
    }
  };
  */
  const updateQuantity = async (sku, quantity) => {
    const customerId = localStorage.getItem("customerId"); // Make sure it's stored
    try {
      await axios.put(`${host}/cart/items/update/${customerId}/${sku}`, null, {
        params: { quantity },
      });
      fetchData(); // Refresh cart data
    } catch (error) {
      console.error("Failed to update quantity:", error.message);
    }
  };



  const updateAddOn = async (sku, cartId, value) => {
    const product = cart.find((item) => item.sku === sku);
    if (product) {
      const updatedProduct = { ...product, addOn: value };
      await axios.put(`${host}/cart/${cartId}`, updatedProduct);
      fetchData();
    }
  };

  const cartNextButton = () => {
    postdata();
    navigate("/login");
  };

  const placeOrderButton = async () => {
    postdata();
    navigate(`/thanks/${orderNo}/dine-in/${totalAmount}`);
  };
  {/*
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "food10") {
      setDiscount(10);
      alert("Coupon applied! 10% discount");
    } else {
      alert("Invalid Coupon Code");
      setDiscount(0);
    }
  };
  */}
  const applyCoupon = async () => {
    const customerId = localStorage.getItem("customerId");

    try {
      const response = await axios.post(`${host}/apply`, {
        customerId: customerId,
        promoCode: couponCode
      });

      alert(response.data); // e.g. "Promo code applied"
      fetchData(); // Refetch cart

    } catch (error) {
      console.error("Error applying promo:", error.message);
      alert("Invalid or expired promo code");
    }
  };


  const removeCoupon = async () => {
    const customerId = localStorage.getItem("customerId");
    try {
      const response = await axios.delete(`${host}/promo/remove/${customerId}`);
      alert(response.data); // e.g. "Promo code removed"
      setCouponCode("");     // Clear input field
      fetchData();           // Refresh cart data
    } catch (error) {
      console.error("Error removing promo:", error.message);
      alert("Failed to remove promo code");
    }
  };


  const placeOrder = async () => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${host}/order/place/${customerId}`,
        {}, // <-- sending empty body instead of null
        {
          params: { paymentMode: paymentMethod },
        }
      );
  
      const invoiceNo = response.data;
      localStorage.setItem("invoiceNo", invoiceNo);
      alert("Order Placed Successfully!");
      navigate("/thanks");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place order: " + (error.response?.data?.message || error.message));
    }
  };
  



  const renderCartItems = () => (
    <div className="container shadow col-11">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Amount</th>
            {/* <th>Add Ons</th>*/}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.cartItemId}>
              <td>{item.product.name}</td>
              <td>
                {locale} {(localevalue * item.product.price).toFixed(2)}
              </td>
              {/*
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    if (!isNaN(newQuantity) && newQuantity >= 1) {
                      // Update quantity only if it's a valid number
                      updateQuantity(item.product.sku, item.cartItemId, newQuantity);
                    }
                  }}
                  className="form-control"
                />
              </td>
              */}
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    if (!isNaN(newQuantity) && newQuantity >= 1) {
                      updateQuantity(item.product.sku, newQuantity); // 👈 Pass only sku and quantity
                    }
                  }}
                  className="form-control"
                />
              </td>

              <td>
                {locale} {(item.quantity * item.product.price * localevalue).toFixed(2)}
              </td>
              {/*
              <td>
                <textarea
                  value={item.addOn}
                  onChange={(e) =>
                    !item.accepted &&
                    updateAddOn(item.product.sku, item.cartItemId, e.target.value)
                  }
                  className="form-control"
                />
              </td>
              */}
              <td>
                <button
                  className={item.accepted ? "btn btn-danger disabled" : "btn btn-danger"}
                  onClick={() => deleteProduct(item.cartItemId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <div className="container mb-3">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-6 d-flex flex-column flex-sm-row gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button className="btn btn-success" onClick={applyCoupon}>
              Apply
            </button>
            <button className="btn btn-danger" onClick={removeCoupon}>
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Sub Total & Tax Details */}
      <table className="table">
        <tbody>
          <tr>
            <td colSpan={2}><b>Sub Total</b></td>
            <td>{locale}{(subTotal * localevalue).toFixed(2)}</td>
          </tr>
          {/*
          <tr>
            <td colSpan={2}><b>SGST ({SGST}%)</b></td>
            <td>{locale} {((discountedAmount * SGST) / 100 * localevalue).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={2}><b>CGST ({CGST}%)</b></td>
            <td>{locale} {((discountedAmount * CGST) / 100 * localevalue).toFixed(2)}</td>
          </tr>
          */}

          <tr>
            <td colSpan={2}><b>Payment Method</b></td>
            <td>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select"
              >
                <option value="Cash On Delivery">Cash On Delivery</option>
                <option value="Card">Card</option>
              </select>
            </td>
          </tr>

          <tr>
            <td colSpan={2}><h5><b>Total</b></h5></td>
            <td>
              <h5>
                {locale} {(totalAmount * localevalue).toFixed(2)}
              </h5>
            </td>
          </tr>
        </tbody>
      </table>

      {/* <div style={{ textAlign: "center" }}>
        <button
          className="btn btn-warning btn-lg mx-auto mb-4"
          onClick={() => {
            option === "take-away" ? cartNextButton() : placeOrderButton();
          }}
        >
          {option === "dine-in" ? "Place Order" : "Next"}
        </button>
      </div>
      */}
      <div style={{ textAlign: "center" }}>
        <button
          className="btn btn-warning btn-lg mx-auto mb-4"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );

  const displayCart = () => (
    <>
      <div className="d-flex">
        <img
          className="my-auto"
          src={backimg}
          height={35}
          width={35}
          onClick={() => navigate("/menu")}
          alt="Back"
        />
        <pre>  </pre>
        <h2 className="invoice-header">Cart</h2>
      </div>
      {cart.length === 0 ? (
        <div className="container border border-warning">
          <p className="my-auto text-center">Your Cart is empty</p>
        </div>
      ) : (
        renderCartItems()
      )}
    </>
  );

  return (
    <div className="cart">
      <div className="container pb-5">
        {view === "invoice" ? navigate("/invoice") : displayCart()}
      </div>
    </div>
  );
};

export default Cart;
