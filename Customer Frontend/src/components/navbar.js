import { Link } from "react-router-dom";
import React from "react";
import cart_icon from "../Images/shopping-cart.png";
import vinlogo from "../Images/vinnaglogo.jpg";
import "../CSS/App.css";

import { FaShoppingCart } from "react-icons/fa"; // Importing FontAwesome icon

const Navbar=({localization,cartCount})=>{
  return <nav className="navbar navbar-expand-lg navbar-dark bg-dark "  style={{position:'sticky',top:'0'}}>
          <div className="container-fluid">
              

          <Link className="navbar-brand ms-3" to={"/"}>
               <span style={{ fontWeight: "bold", fontSize: "20px", color: "white" }}>
                ORDER NOW
                </span>
         </Link>
              <div style={{display:"flex"}}>
                  <Link to={"/menu"} className="btn btn-outline-light mx-4 my-auto">Menu</Link>
              <Link to={"/cart"} className="me-3">
              <div style={{ position: "relative" }}>
                            <FaShoppingCart className="mx-3" style={{ color: "white",fontSize:'30px' }} />
                            {cartCount > 0 && (
                                <span className="bg-danger" style={{
                                    position: "absolute",
                                    top: -10,
                                    right:0,
                                    color:'white',
                                    borderRadius: "50%",
                                    padding: "5px",
                                    fontSize: "10px"
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
              </Link>
              </div>
          </div>
      </nav>
}
export default Navbar;