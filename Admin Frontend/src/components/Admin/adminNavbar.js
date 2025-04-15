import React from "react";
import { Link } from "react-router-dom";
import Main from "../apicalling";
import navlogo from "../../Images/vinnaglogo.jpg";

const AdminNavbar=({ localization, onLogout }) =>{
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{position:'sticky',top:'0'}}>
            <div className="container-fluid">
                <Link className="navbar-brand " to={"/"}>{/*<img src={navlogo} width={50} height={60}/>*/}</Link>
                <div style={{ display: "flex" }}>
                    <Link to={"/listProducts"} className="btn btn-outline-light mx-2">Products List</Link>
                    <Link to={"/addproduct"} className="btn btn-outline-light mx-2">Add Products</Link>
                    <Link to={"/employees"} className="btn btn-outline-light mx-2">Employees</Link>
                    <Link to={"/"} className="btn btn-outline-light mx-2">Track Orders</Link>
                    {/*<Link to={"/reviews"} className="btn btn-outline-light mx-2">Reviews</Link>*/}
                    <Link to={"/settings"} className="btn btn-outline-light mx-2">Settings</Link>
                    {/* <Main localization={localization}/> */}
                    <button className="mx-2 my-auto" onClick={onLogout}>Log Out</button>
                </div>
            </div>
        </nav>
    )

}
export default AdminNavbar;