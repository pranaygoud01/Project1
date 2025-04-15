import React from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

class OrderExportButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  fetchOrdersData = () => {
    axios.get('http://localhost:8080/allOrders')
      .then(response => {
        const orders = response.data;
        this.setState({ orders }, this.exportToExcel);
      })
      .catch(error => {
        console.error('Error fetching orders data:', error);
      });
  };

  exportToExcel = () => {
    const { orders } = this.state;
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
  };

  render() {
    return (
      <button onClick={this.fetchOrdersData}>Export Orders</button>
    );
  }
}

export default OrderExportButton;
