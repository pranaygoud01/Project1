import React from "react";
import axios from "axios";
import { useState } from "react";
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import "../../CSS/App.css";


export default function DownloadWindow({host}) {
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('12 months');
    const [orders,setOrders]=useState([]);
    const navigate=useNavigate();
    /*
    const handleDownload = async () => {
        try {
            const response = await axios.get(`${host}/orders/download/${selectedTimeFrame}`);
            setOrders(response.data);

            const worksheet = XLSX.utils.json_to_sheet(orders);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                const fileName = 'orders.xlsx';
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
          
            // const blob = new Blob([response.data], { type: 'application/octet-stream' });
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'orders.xlsx';
            // document.body.appendChild(a);
            // a.click();
            // window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading orders:', error);
        }
    };
    */
    const handleDownload = async () => {
        try {
            const response = await axios.get(`${host}/orders/download/${selectedTimeFrame}`);
            const ordersData = response.data;
            console.log("Orders data:", ordersData);
    
            if (!Array.isArray(ordersData) || ordersData.length === 0) {
                alert("No records available for the selected timeframe.");
                return;
            }
    
            const flatData = ordersData.map(order => ({
                ...order,
                items: order.items?.map(item => `${item.name} x${item.quantity}`).join(', ') || ''
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(flatData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders_${selectedTimeFrame.replace(/\s+/g, '_')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading orders:', error);
        }
    };
    
    

    return (<div className="modal-content container shadow">
            <div className="container">
                <label>Select Time Frame</label>
                <select value={selectedTimeFrame} onChange={(e) => setSelectedTimeFrame(e.target.value)}>
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                </select>
                <button className="mx-3 border btn my-auto btn-warning" onClick={()=>handleDownload()}>Download</button>
                <button className="border"  onClick={()=>navigate("/orders")}><b style={{color:'red'}}>X</b></button>
            </div>
            </div>
    );
};
