import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import backimg from "../../Images/backimg.png";
import { useNavigate } from 'react-router-dom';
import "../../CSS/App.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Invoice = ({ host, Order, date, localevalue, locale }) => {
    const [invoice, setInvoice] = useState({
        invoiceNo: '',
        orderNo: '',
        amount: '',
        date: '',
        sgst: '',
        cgst: '',
        serviceTax: '',
        totalAmount: '',
        paymentMode: '',
        cart: []
    });

    let orderNo = Order;

    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState();
    const [promoDetails, setPromoDetails] = useState();
    const [msg, setMsg] = useState('No promocode applied');

    // Ref for printing
    const componentRef = useRef();

    useEffect(() => {
        const response = axios.get(`http://localhost:8080/orders/${date}/${orderNo}`);
        response.then(result => {
            const data = result.data;
            setInvoice(data); // This will log the data variable
        })
    }, [promoDetails]);

    const getPromoDetails = () => {
        try {
            const response = axios.get(`${host}/promo/${promoCode}`)
            response.then((result) => {
                setPromoDetails(result.data)
            })
        } catch {
            console.log('Error fetching promoCode details')
        }

        setMsg(() => {
            if(promoDetails!=null){
                console.log(promoDetails.id,promoDetails)
                axios.put(`${host}/promo/${promoDetails.id}`,{...promoDetails,used:true}).then(()=>console.log('promo'))
            }
            if (promoDetails==null) {
                return 'Invalid promo code' ;
            }

            if (promoDetails.used) {
                return 'Promo code already used' ;
            }

            if (new Date() > new Date(promoDetails.expDate)) {
                return 'Promo code expired' ;
            }

            return promoDetails.discount +' discount added';
        })


    }

    // Function to handle printing
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container  invoice py-5 mx-auto col-md-10" ref={componentRef}>
            <div>
                <label><input type='text' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} /></label>
                <button className='btn btn-success' onClick={() => getPromoDetails()}>Verify</button>{msg}
            </div>
            <h2 className="invoice-header">Invoice Generator</h2>
            <div className=' container mb-3 col-md-11 col-lg-5 shadow' style={{ textAlign: 'center' }}><div className='container border border-secondary'>
                <div><b>Invoice<br />XYZ industries Pvt Ltd</b></div>
                <div className="invoice-info border border-secondary my-2 py-1">
                    <div className=' mx-auto'><label>Invoice Number: </label>
                        <label>{invoice.invoiceNo}</label><br />
                        <label>Invoice Date: </label>
                        <label>{invoice.date}</label><br />
                        <label>Order No: </label>
                        <label>{invoice.orderNo}</label>
                    </div>
                </div>
                {/* Item list */}
                <div className="item-list border border-secondary my-2 py-1">
                    {/* Iterate through items */}

                    <div className="item-row">
                        <table style={{ width: '100%' }}>
                            <thead><tr><td><b>Name</b></td><td><b>Price</b></td><td><b>Quantity</b></td></tr></thead>
                            <tbody>
                                {invoice.cart.map((item) => (
                                    <tr><td>{item.name}</td><td>{locale} {(item.price * localevalue).toFixed(2)}</td><td>{item.quantity}</td></tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="totals border border-secondary my-2 py-1">
                    <table className='mx-auto'><tbody><tr><td>Subtotal:</td><td>{locale} {(invoice.amount * localevalue).toFixed(2)}</td></tr>
                        <tr><td>State Tax ({invoice.sgst}%):</td><td>{locale} {(((invoice.sgst * invoice.amount) / 100) * localevalue).toFixed(2)}</td></tr>
                        <tr><td>Central Tax ({invoice.cgst}%):</td><td>{locale} {(((invoice.cgst * invoice.amount) / 100) * localevalue).toFixed(2)}</td></tr>
                        <tr><td>Service charges ({invoice.serviceTax} %):</td><td>{locale} {(((invoice.serviceTax * invoice.amount) / 100) * localevalue).toFixed(2)}</td></tr>
                        <tr><td><b>Total:</b></td><td><b>{locale} {Math.round(((((invoice.sgst + invoice.cgst + invoice.serviceTax) * invoice.amount) / 100) + invoice.amount) * localevalue)}</b></td></tr>
                    </tbody></table>
                </div>
                <button onClick={handlePrint} className='print-button mx-2'>Print</button>
                <button className='download-button mx-2'>Download</button><br />
            </div>
                <div className='container mt-4'>
                    <button className='btn btn-warning my-2' style={{ textAlign: 'center' }} onClick={() => { console.log(invoice.totalAmount); navigate(`/QRCode/${invoice.totalAmount}`) }}>Pay</button>
                </div>
            </div>

        </div>

    );
}
export default Invoice;