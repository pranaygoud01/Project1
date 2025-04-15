import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import dineinimage from "../../Images/dineinimage.jpg"
import takeawayimage from "../../Images/takeaway.avif"
import "../../CSS/App.css";
import { useNavigate } from "react-router-dom";
import vinlogo from "../../Images/vinnaglogo.jpg";

export default function UserHome({options,setContact,contact,setOrderNo,user,setUser,setToday}) {
    const navigate=useNavigate();
    const handleButtonClick = (option) => {
       if(contact){
        if (contact.length === 10 && /^\d+$/.test(contact)) {
            options(option);
            navigate('/menu');
        }else{
            window.alert('Please Enter 10 digits number')
        }
       }else{
        window.alert('Enter contact number')
       }
      };

useEffect(()=>{
    setUser(()=>{
        if(user){
          const newuser =user + 1;
          localStorage.setItem('userId', newuser);
          return newuser;
        }
        else{
          localStorage.setItem('userid', 10000);
          return 10000;
        }
      });
      setOrderNo(() => {
            const currentDate = new Date().toISOString().split('T')[0];
      
            const storedDate = new Date(localStorage.getItem('date')).toISOString().split('T')[0];
      
            if (storedDate && (currentDate === storedDate)) {
                const newCount =user + 1;
                localStorage.setItem('renderStoreCount', newCount);
                setToday(new Date(storedDate).toISOString().split('T')[0]);
                return newCount;
            } else {
                localStorage.setItem('date', currentDate);
                localStorage.setItem('renderStoreCount', 110000);
                setToday(new Date(currentDate).toISOString().split('T')[0]);
                return 110000;
            }
        })
},[])

    return<><div className="container mt-3 pb-2 col-9 shadow">
    <div  style={{textAlign:'center'}} className=" pt-4"><label className="form-label" style={{color:'grey'}}><h5>Mobile No.</h5><input className="form-control" type="text" pattern="[0-9] {10}" minLength={10} maxLength={10} value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Please Enter Mobile No.." required autoComplete="true"/></label></div>
    <div className="container my-4 col-md-10 col-lg-6" style={{textAlign:'center'}}>
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