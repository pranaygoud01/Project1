import React from "react";
import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import Review from "./review";
import "../CSS/App.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";


const QRCode=({upiId,contact,date,locale})=>{  
    const [qrCode, setQrCode] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState('');

    const {totalAmount} =useParams();

    const navigate=useNavigate();
    console.log(upiId,totalAmount)
    useEffect(()=>{
        
                const QRresponse = axios.get('http://localhost:8080/generateQRCode', {
                    params: { upiId, totalAmount },
                    responseType: 'arraybuffer',
                });
                console.log(upiId)
                QRresponse.then((result)=>{
                    console.log(result.data)
                    const base64Image = btoa(
                        new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    setQrCode(`data:image/png;base64,${base64Image}`);
                })
                const generateUpiLink = () => {
                    const payeeName = encodeURIComponent("Restaurant Name");
                    const transactionNote = encodeURIComponent("Payment for Order");
                    const amountString = totalAmount;
        
                    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${payeeName}&tn=${transactionNote}&am=${amountString}&cu=INR`;
                    setPaymentUrl(upiUrl);
                };
        
                generateUpiLink();
                
            
    },[upiId,totalAmount])

    return <div className="container col-11"><div className="row">
    <div className="container QRCode shadow pb-3 my-4 col-md-6">
        <div className='d-flex'>
            {/* <img className='my-auto' src={backimg} height={35} width={35} onClick={() =>navigate('/cart')} /> */}
          <pre>  </pre>
          <h2 className='my-3'>Scan Here to Pay</h2></div>
        <div className="mx-auto" style={{textAlign:'center'}}>
            <h5>{locale} {totalAmount}</h5>
            {qrCode && <img  className="mx-auto" src={qrCode} alt="UPI QR Code" />}
            {qrCode && <h5 style={{color:'green'}}>Scan and Pay</h5>}
        </div>
        <div>
        <a href={paymentUrl} target="_blank" rel="noopener noreferrer">Click here to Pay via app</a>
        </div>
    </div>
    <div className="col-md-6">
        <Review contact={contact} date={date}/>
    </div>
    </div>
    </div>
}
export default QRCode;