// AdminDashboard.js
import React from 'react';
import AdminNavbar from './adminNavbar';
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import AddProducts from './add_products';
import Employees from './employees';
import DownloadWindow from './DownloadWindow';
import Settings from './settings';
import Reviews from './adminreviews';
import EditProductsAdmin from './edit_product';
import ListProductsAdmin from './list_products';
import OrdersAdmin from './orders';

const AdminDashboard = ({SGST,CGST,upiId,host, adminName ,onLogout,localization,value,locale}) => {
  return (
    <div>
        <Router>
        <AdminNavbar localization={localization} onLogout={onLogout}/>
            <Routes>
                <Route path='/' element={<ListProductsAdmin host={host}  localevalue={value} locale={locale}/>}/>
                <Route path='/addproduct' element={<AddProducts host={host}/>}/>
                <Route path='/employees' element={<Employees host={host}/>}/>
                <Route path='/orders' element={<OrdersAdmin host={host} localevalue={value} locale={locale}/>}/>
                <Route path={`/editproductadmin/:id`} element={<EditProductsAdmin host={host} />}/>
                <Route path='/downloadRecords' element={<DownloadWindow host={host}/>}/>
                <Route path='/settings' element={<Settings SGST={SGST} CGST={CGST} upiid={upiId} host={host}/>}/>
                <Route path='/reviews' element={<Reviews host={host}/>}/>
            </Routes>
        </Router>
        
      
    </div>
  );
};

export default AdminDashboard;
