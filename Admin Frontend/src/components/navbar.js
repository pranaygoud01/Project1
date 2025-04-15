import React from "react";
import { Link } from "react-router-dom";
import Main from "./apicalling";
import cart_icon from "../Images/shopping-cart.png";

export default function Navbar({localization}) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{position:'sticky',top:'0'}}>
            <div className="container-fluid">
                <Link className="navbar-brand" to={"/"}><h2>Navbar</h2></Link>
                <div style={{display:"flex"}}>
                    <Link to={"/menu"} className="btn btn-outline-light mx-4">Menu</Link>
                {/* <Link to={"/listproducts"} className="btn btn-outline-light mx-4">Products List</Link>
                <Link to={"/addproduct"} className="btn btn-outline-light mx-2">Add Products</Link> */}
                <Link to={"/cart"}><img src={cart_icon} alt="cart" className="mx-3" height={40} width={50}/></Link>
                {/* <Main localization={localization}/> */}
                </div>
            </div>
        </nav>
    )

}