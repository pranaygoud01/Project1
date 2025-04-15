import React from "react";
import { Link, useNavigate } from "react-router-dom";
import dineinimage from "../Images/dineinimage.jpg"
import takeawayimage from "../Images/takeaway.jpg"
import "../CSS/App.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";

export default function UserHome({ options, setContact, contact }){
    const navigate = useNavigate();
    const handleButtonClick = (option) => {
        if(contact){
            if (contact.length === 10 && /^\d+$/.test(contact)) {
                options(option);
                navigate('/menu');
            }
        }else{
            console.log("Please Enter Mobile No..")
        }
    };
    return<><div className="container mt-3 pb-2 col-9 shadow">
    <div  style={{textAlign:'center'}} className=" pt-4"><label className="form-label" style={{color:'grey'}}><h5>Mobile No.</h5><input className="form-control" type="text" pattern="[0-9] {10}" minLength={10} maxLength={10} value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Please Enter Mobile No.." required autoComplete="true"/></label></div>
    <div className="container my-4 col-md-10 col-lg-6">
        <div className="options" >
            {/* <button type="submit" className="mx-4" style={{background:'transparent',border:'none'}}  onClick={()=>handleButtonClick('dine-in')}> */}
                {/* <img  className='btn' src={dineinimage} height={300}/> */}
                <button onClick={()=>handleButtonClick('dine-in')} className="btn btn-lg btn-success my-2 mx-5">Dine-In</button>
            {/* </button> */}
            {/* <button type="submit" className="mx-4" style={{background:'transparent',border:'none'}}  onClick={()=>handleButtonClick('take-away')}> */}
                {/* <img  className='btn' src={takeawayimage} height={300}/> */}
                <button onClick={()=>handleButtonClick('take-away')} className="btn btn-lg btn-danger my-2 mx-5">Take-Away</button>
            {/* </button> */}
        </div>
    </div>
</div>
<div class="footer-section pt-5 pb-5">
    <div class="container">
        <div class="row">
            <div class="col-12 text-center">
                <img src={vinlogo} height={70}  />
                <h1 class="footer-section-mail-id">orderfood@vinnag.com</h1>
                <p class="footer-section-address">
                    Hyderabad, Telengana, India.
                </p>
            </div>
        </div>
    </div>
</div>
</>
}