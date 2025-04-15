import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../ContextAPI/userdata";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backimg from "../Images/backimg.png";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const [invoice, setInvoice] = useState({
    invoiceNo: '',
    orderNo: '',
    invoiceDate: '',
    items: [],
    subtotal: '',
    sgst: '',
    cgst: '',
    serviceTax: '',
    total: '',
    paymentMode: '' 
  });

  const componentRef = useRef();
  const navigate = useNavigate();

  const { locale, value: localevalue } = useContext(AppContext);

  useEffect(() => {
    const invoiceNo = localStorage.getItem("invoiceNo");
    if (invoiceNo) {
      axios.get(`http://localhost:8080/invoice/${invoiceNo}`)
        .then((res) => setInvoice(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const input = componentRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      // Calculate width and height
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice.invoiceNo || "download"}.pdf`);
    });
  };

  return (
    <div className="container invoice py-5 mx-auto col-md-10" ref={componentRef}>
      <h2 className="invoice-header">Invoice Generator</h2>

      <div className='container mb-3 col-md-11 col-lg-5 shadow' style={{ textAlign: 'center' }}>
        <div className='container border border-secondary'>
          <div><b>Invoice<br />XYZ Industries Pvt Ltd</b></div>

          {/* Invoice Info */}
          <div className="invoice-info border border-secondary my-2 py-1">
            <div className='table mx-auto'>
              <label>Invoice Number: </label><label>{invoice.invoiceNo}</label><br />
              <label>Invoice Date: </label><label>{invoice.invoiceDate}</label><br />
              <label>Order No: </label><label>{invoice.orderNo}</label><br/>
              <label>Payment Mode: </label><label>{invoice.paymentMode}</label>
            </div>
          </div>

          {/* Item List */}
          <div className="item-list border border-secondary my-2 py-1">
            <table style={{ width: '100%' }}>
              <thead>
                <tr><th>Name</th><th>Price</th><th>Quantity</th></tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{locale} {(item.price * localevalue).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="totals border border-secondary my-2 py-1">
            <table className='mx-auto'>
              <tbody>
                <tr><td>Subtotal:</td><td>{locale} {(invoice.subtotal * localevalue).toFixed(2)}</td></tr>
                <tr><td>Discounted Price:</td><td>{locale} {(invoice.discountedAmount * localevalue).toFixed(2)}</td></tr>
                <tr><td>State Tax ({invoice.sgst}%):</td><td>{locale} {(((invoice.sgst * invoice.total) / 100) * localevalue).toFixed(2)}</td></tr>
                <tr><td>Central Tax ({invoice.cgst}%):</td><td>{locale} {(((invoice.cgst * invoice.total) / 100) * localevalue).toFixed(2)}</td></tr>
                <tr><td>Service Tax ({invoice.serviceTax}%):</td><td>{locale} {(((invoice.serviceTax * invoice.total) / 100) * localevalue).toFixed(2)}</td></tr>
                <tr>
                  <td><b>Grand Total:</b></td><td><b>
                  <td><b>{locale} {(invoice.total * localevalue).toFixed(2)}</b></td>
                </b></td></tr>
              </tbody>

            </table>
          </div>

          <button onClick={handlePrint} className='print-button mx-2'>Print</button>
          <button onClick={handleDownload} className='download-button mx-2'>Download</button>
        </div>

        {/* Pay Button */}
        <div className='container mt-4'>
          <button
            className='btn btn-warning my-2'
            onClick={() => navigate(`/QRCode/${invoice.total}`)}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
