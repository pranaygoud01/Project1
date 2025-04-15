import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../ContextAPI/userdata";
import Modal from "./ModalWindow";
import axios from "axios";
import { FaShoppingCart, FaStar } from "react-icons/fa";

const Menu = () => {
  const {host, userId, option, locale, cartCount, setCartCount} = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);


  useEffect(() => {
    const fetchProducts = () => {
      axios
        .get( `${host}/products/available`)
        .then((response) => {
          setProducts(response.data);
          setLoading(false); // stop showing loading once data arrives
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    };

    fetchProducts(); // initial fetch
    const interval = setInterval(fetchProducts, 10000); // fetch every 10 sec

    return () => clearInterval(interval);
  }, [option]);
  

  const addtocart = async (product) => {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please register or log in first.");
      return;
    }

    const cartItem = {
      customerId: parseInt(customerId),
      sku: product.sku,
      quantity:
        Number.isInteger(product.quantity) && product.quantity > 0
          ? product.quantity
          : 1,
    };

    try {
      const response = await axios.post(`${host}/cart/items/add`, cartItem);
      console.log("Item added to cart:", response.data);
      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );
      alert("Failed to add item to cart.");
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedProducts = products.map((item) =>
      item.sku === productId ? { ...item, quantity: newQuantity } : item
    );
    setProducts(updatedProducts);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: "#f5f6fa", minHeight: "100vh", paddingBottom: "60px" }}>
      <h2 className="text-center pt-4 mb-4">Menu</h2>

      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => {
            const discountedPrice = (product.price - (product.price * product.discount) / 100).toFixed(2);
            return (
              <div className="col" key={product.sku}>
                <div
                  className="card text-start shadow-sm position-relative"
                  style={{
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    border: "none",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  onClick={() => openModal(product)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {/* Discount badge - only shown if necessary */}
                  {product.discount > 0 && false && (
                    <span
                      className="position-absolute top-0 start-0 badge"
                      style={{
                        background: "#F0473A",
                        color: "#fff",
                        fontSize: "12px",
                        padding: "6px 10px",
                        borderTopLeftRadius: "20px",
                        borderBottomRightRadius: "10px",
                      }}
                    >
                      {product.discount}% Off
                    </span>
                  )}

                  {/* Product image */}
                  <div className="d-flex justify-content-center align-items-center p-4" style={{ background: "#ffffff" }}>
                    <img
                     src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                        style={{
                        width: "250px",
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="p-3">
                    {/* Star rating */}
                    <div className="d-flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} style={{ color: "#FFA500", marginRight: "2px", fontSize: "16px" }} />
                      ))}
                    </div>
                    
                    {/* Product name */}
                    <h6 className="mb-1 fw-bold">{product.name}</h6>
                    
                    {/* Product price */}
                    <p className="mb-2" style={{ fontSize: "16px", fontWeight: "500" }}>
                      {product.discount ? (
                        <>
                          <span>{locale}{discountedPrice}</span>
                        </>
                      ) : (
                        <span>{locale}{product.price.toFixed(2)}</span>
                      )}
                    </p>
                  </div>

                  {/* Cart button */}
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#F47A3C",
                      color: "#fff",
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      fontSize: "18px",
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      transition: "transform 0.2s ease",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0",
                    }}
                    onClick={() => addtocart(product)}x
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
  <button
    onClick={() => navigate("/cart")}
    className="btn shadow-lg"
    style={{
      backgroundColor: "#F47A3C",
      color: "#fff",
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 0,
      border: "none",
      boxShadow: "0 6px 20px rgba(244, 122, 60, 0.4)",
      transition: "transform 0.2s ease, box-shadow 0.3s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 10px 25px rgba(244, 122, 60, 0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 20px rgba(244, 122, 60, 0.4)";
    }}
  >
    <FaShoppingCart style={{ fontSize: "26px" }} />
  </button>
  {cartCount > 0 && (
    <span
      className="fw-bold"
      style={{
        position: "absolute",
        top: "-5px",
        right: "-5px",
        borderRadius: "50%",
        width: "28px",
        height: "28px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "14px",
        backgroundColor: "#FF3B30",
        color: "white",
        border: "2px solid #fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
      }}
    >
      {cartCount}
    </span>
  )}
</div>
    </div>
  );
};

export default Menu;