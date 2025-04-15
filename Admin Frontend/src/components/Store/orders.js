import React, { useEffect, useState } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../CSS/App.css";
import axios from 'axios';

const Orders = ({ host, date, localevalue, locale }) => {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get(`${host}/store/orders`)
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => b.orderNo - a.orderNo);
        setOrders(sortedOrders);
      })
      .catch((err) => {
        console.error('Error fetching all orders:', err);
      });
  };

  const searchOrders = () => {
    const keyword = search.trim();
    let params = {};

    if (!isNaN(Number(keyword))) {
      if (keyword.length === 10) {
        params.contact = keyword;
      } else {
        params.orderNo = keyword;
      }
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(keyword)) {
      params.date = keyword;
    } else {
      params.customerName = keyword;
    }


    axios.get(`${host}/orders/search`, { params })
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => b.orderNo - a.orderNo);
        setOrders(sortedOrders);
      })
      .catch((err) => {
        console.error('Error searching orders:', err);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchOrders();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const markAsPaid = (orderNo) => {
    axios.patch(`${host}/${orderNo}/mark-paid`)
      .then(() => setTimeout(searchOrders, 500))
      .catch(err => console.error('Error marking order as paid:', err));
  };

  const acceptClick = (orderNo) => {
    axios.patch(`${host}/${orderNo}/accept`)
      .then(() => searchOrders())
      .catch(err => console.error('Error accepting order:', err));
  };

  return (
    <div className='orders pt-4 pb-4'>
      <div className="search-container col-md-3 col-sm-9 mx-auto mb-3">
        <input
          type="text"
          placeholder="Search by Order No, Contact, Customer Name, or Date (yyyy-MM-dd)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input form-control"
        />
      </div>

      <div className='container shadow mx-auto pb-2 shadebackground'>
        <h2>Orders</h2>
        <table className='table mx-auto'>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Contact</th>
              <th>Customer Name</th>
              <th>Customer Address</th>
              <th>Payment Status</th>
              <th>Payment Mode</th>
              <th>Ordered Items</th>
              <th>Total Price</th>
              <th>Accept</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">No orders found</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.orderNo}>
                  <td>{order.orderNo ?? 'N/A'}</td>
                  <td style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>{order.date ?? 'N/A'}</td>
                  <td>{order.contact ?? 'N/A'}</td>
                  <td>{order.customerName ?? 'N/A'}</td>
                  <td>{order.customerAddress ?? 'N/A'}</td>
                  <td>
                    <button
                      className={`btn ${order.paymentStatus === "Paid" ? 'btn-success' : 'btn-danger'} my-auto`}
                      disabled={order.paymentStatus === "Paid"}
                      onClick={() => {
                        if (order.paymentStatus !== "Paid") markAsPaid(order.orderNo);
                      }}
                    >
                      {order.paymentStatus === "Paid" ? 'Paid' : 'Not Paid'}
                    </button>
                  </td>
                  <td>{order.paymentMode ?? 'N/A'}</td>
                  <td>
                    <select className='form-select'>
                      {order.orderedItems && order.orderedItems.length > 0 ? (
                        order.orderedItems.map((item, index) => (
                          <option key={index}>
                            {item.name ?? 'Item'} (Qty: {item.quantity ?? 0})
                          </option>
                        ))
                      ) : (
                        <option>No items</option>
                      )}
                    </select>
                  </td>
                  <td>{locale} {(localevalue * (order.totalPrice ?? 0)).toFixed(2)}</td>
                  <td>
                    <button
                      className={`btn ${order.orderAccept ? 'btn-secondary disabled' : 'btn-success'} my-auto`}
                      onClick={() => !order.orderAccept && acceptClick(order.orderNo)}
                    >
                      {order.orderAccept ? 'Accepted' : 'Accept'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
