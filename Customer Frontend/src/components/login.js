import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    postCode: "",
    floor: "",
    landmark: "",
    locationType: "home",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationType = (type) => {
    setFormData({ ...formData, locationType: type });
  };

  /*const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Address Details:", formData);

    // Navigate to menu page instead of invoice
    navigate("/menu");
  };
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { locationType, ...dataToSend } = formData;
  
    try {
      const response = await axios.post("http://localhost:8080/customers", dataToSend);
      const customerId = response.data;
  
      console.log("Customer saved. ID:", customerId);
  
      // Save the customerId to localStorage
      localStorage.setItem("customerId", customerId);
  
      //  Navigate only after successful save
      navigate("/menu");
    } catch (error) {
      console.error("Error saving customer:", error.response?.data || error.message);
      alert("Failed to save customer. Please try again.");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Enter Customer details</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Customer's name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Customer's contact</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/*
          <div className="location-type">
            <p>Tag this location for later</p>
            <div className="location-options">
              {["home", "work", "hotel", "other"].map((type) => (
                <button
                  type="button"
                  key={type}
                  className={formData.locationType === type ? "active" : ""}
                  onClick={() => handleLocationType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          */}
          <div className="input-group">
            <label>Complete Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Postcode</label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Floor (Optional)</label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="login-btn">
            Confirm address
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
