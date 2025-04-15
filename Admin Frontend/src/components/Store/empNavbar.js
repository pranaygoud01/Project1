import React from "react";
import { Link } from "react-router-dom";
import navlogo from "../../Images/vinnaglogo.jpg";

export default function StoreNavbar({ localization, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ position: 'sticky', top: '0' }}>
            <div className="container-fluid">
                <Link className="navbar-brand ms-4" to={"/"}>{/*<img src={navlogo} height={50} width={60} style={{borderRadius:'10px'}}/>*/}</Link>
                <div style={{ display: "flex" }}>
                    <Link to={"/"} className="btn btn-outline-light mx-2">Track Orders</Link>

                   {/* <Link to={"/listProducts"} className="btn btn-outline-light mx-2">Products List</Link>*/}
                    

                    <Link to={"/productslist"} className="btn btn-outline-light mx-2">Products List</Link>
                    {/* <Link to={"/userhome"} className="btn btn-outline-light mx-2">Place Order</Link> */}
                    {/* <Main localization={localization}/> */}
                    <button className="mx-2 my-auto" onClick={onLogout}>Log Out</button>
                </div>
            </div>
        </nav>
    )

}