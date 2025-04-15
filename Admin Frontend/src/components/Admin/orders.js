import React, { useEffect, useState } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../CSS/App.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableCell, TableRow
} from 'docx';

const OrdersAdmin = ({ host, localevalue, locale }) => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    axios.get(`${host}/invoices`)
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch((err) => console.error("Failed to fetch invoices", err));
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const input = value.trim().toLowerCase();
  
    if (input === "") {
      setFilteredOrders(orders);
      return;
    }
  
    const filtered = orders.filter(order => {
      const invoiceStr = order.invoiceNo ? order.invoiceNo.toString().toLowerCase() : "";
      const orderStr = order.orderNo ? order.orderNo.toString().toLowerCase() : "";
      const dateStr = order.invoiceDate ? order.invoiceDate.toString().toLowerCase() : "";
  
      return (
        invoiceStr.includes(input) ||
        orderStr.includes(input) ||
        dateStr.includes(input)
      );
    });
  
    setFilteredOrders(filtered);
  };
  
  

  const downloadInvoice = async (invoiceNo) => {
    const res = await axios.get(`${host}/invoice/${invoiceNo}`);
    const orderData = res.data;

    const border = {
      top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
    };

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `Invoice`, bold: true }),
                new TextRun({ text: `XYZ industries Pvt Ltd`, bold: true, break: 1 }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border,
              children: [
                new TextRun({ text: `Invoice Number: ${orderData.invoiceNo}` }),
                new TextRun({ text: `Invoice Date: ${orderData.invoiceDate}`, break: 1 }),
                new TextRun({ text: `Order No: ${orderData.orderNo}`, break: 1 }),
              ],
            }),
            new Paragraph({ children: [new TextRun({ break: 1 })] }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Name")] }),
                    new TableCell({ children: [new Paragraph("Price")] }),
                    new TableCell({ children: [new Paragraph("Quantity")] }),
                  ],
                }),
                ...orderData.items.map(item =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(item.name)] }),
                      new TableCell({
                        children: [new Paragraph(`${locale} ${(item.price * localevalue).toFixed(2)}`)]
                      }),
                      new TableCell({ children: [new Paragraph(item.quantity.toString())] }),
                    ],
                  })
                )
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border,
              children: [
                new TextRun({ text: `Subtotal: ${locale} ${(orderData.subtotal * localevalue).toFixed(2)}`, break: 1 }),
                new TextRun({ text: `State Tax (${orderData.sgst}%): ${locale} ${((orderData.subtotal * orderData.sgst / 100) * localevalue).toFixed(2)}`, break: 1 }),
                new TextRun({ text: `Central Tax (${orderData.cgst}%): ${locale} ${((orderData.subtotal * orderData.cgst / 100) * localevalue).toFixed(2)}`, break: 1 }),
                new TextRun({ text: `Service Tax: ${locale} ${(orderData.serviceTax * localevalue).toFixed(2)}`, break: 1 }),
                new TextRun({ text: `Total: ${locale} ${(orderData.total * localevalue).toFixed(2)}`, bold: true, break: 1 }),
              ]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `invoice-${invoiceNo}.docx`);
  };

  return (
    <div className='orders pt-4 pb-4'>
    <div className="search-container col-md-3 col-sm-9 mx-auto mb-3">
      <input
        type="text"
        placeholder="Search... (Invoice No, Order No, Date)"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input form-control"
      />
    </div>
  
    <div className='container shadow mx-auto pb-2 shadebackground'>
      <div className="d-flex justify-content-between align-items-center pt-3 px-2">
        <h2>Invoices</h2>
        <Link to='/downloadRecords' className='btn btn-primary'>
          Download Records
        </Link>
      </div>
  
      <table className='table mx-auto mt-3'>
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Order Number</th>
            <th>Date</th>
            <th>Payment Mode</th>
            <th>Items</th>
            <th>Total Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.invoiceNo}>
              <td>{order.invoiceNo}</td>
              <td>{order.orderNo}</td>
              <td>{order.invoiceDate}</td>
              <td>{order.paymentMode}</td>
              <td>
                <select className="form-select">
                  {order.items.map((item, i) => (
                    <option key={i}>
                      {item.name} - {item.quantity}
                    </option>
                  ))}
                </select>
              </td>
              <td>{locale} {(order.total * localevalue).toFixed(2)}</td>
              <td>
                <button
                  className='btn bg-warning'
                  onClick={() => downloadInvoice(order.invoiceNo)}
                >
                  Download Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default OrdersAdmin;
