//products

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import { useEffect, useState } from 'react';
import "./CSS/App.css"
import AdminLogin from '../src/components/Admin/adminLogin';
import AdminDashboard from '../src/components/Admin/adminDashboard';
import StoreDashboard from './components/Store/storeDashboard';
import StoreLogin from './components/Store/storeLogin';
import axios from 'axios';
import Login from "./components/LoginPage";
import AdminNavbar from "./components/Admin/adminNavbar";
import StoreNavbar from "./components/Store/empNavbar";
import EditProductsAdmin from "./components/Admin/edit_product";
import ListProductsAdmin from "./components/Admin/list_products";
import OrdersAdmin from "./components/Admin/orders";
import Orders from "./components/Store/orders";
import AddProducts from "./components/Admin/add_products";
import Employees from "./components/Admin/employees";
import DownloadWindow from "./components/Admin/DownloadWindow";
import Settings from "./components/Admin/settings";
import Reviews from "./components/Admin/adminreviews";
import ListProducts from "./components/Store/list_products";
import UserHome from "./components/Store/userHome";
import EditProducts from "./components/Store/edit_product";
import Products from "./components/Store/products";
import Cart from "./components/Store/cart";
import ThanksPage from "./components/Store/thankspage";
import QRCode from "./components/Store/QRCode";
import Invoice from "./components/Store/invoice";



const App = () => {
  const [value, setvalue] = useState(1);
  const [locale, setlocale] = useState("£");
  const [currency, setCurrency] = useState("INR");
  const host = 'http://localhost:8080';

  const [adminName, setAdminName] = useState('admin')
  const [adminPassword, setAdminPassword] = useState('password');
  const [storeName, setStoreName] = useState('store');
  const [storePassword, setStorePassword] = useState('password');

  const [SGST, setSGST] = useState();
  const [CGST, setCGST] = useState();
  const [upiId, setUpiId] = useState();
  const [serviceTax,setServiceTax]=useState();

  
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try{
         axios.get(`${host}/settings/sgst`).then((result) => setSGST(result.data));
         axios.get(`${host}/settings/cgst`).then((result) => setCGST(result.data));
         axios.get(`${host}/settings/upiid`).then((result) => setUpiId(result.data));
         axios.get(`${host}/settings/serviceTax`).then((result) => setServiceTax(result.data));
         console.log(serviceTax)
    }
    catch{
      console.log("Error fetching SGST,CGST,upiId");
    }
  }, [])

  const localization = (value, locale, currency) => {
    setvalue(value);
    setlocale(locale);
    setCurrency(currency);
  }

  const [name, setName] = useState(null);
  //
  const [user, setUser] = useState(null);



  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  
  useEffect(() => {
    document.title = "Restaurent-App - LOGIN";
  })





  const [option, setOption] = useState('dine-in');
  const [contact, setContact] = useState();
  //const [user, setUser] = useState(() => { return parseInt(localStorage.getItem('userId')) || 10000; });

  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
  const [orderNo, setOrderNo] = useState(() => { return parseInt(localStorage.getItem('renderStoreCount')) || 110000; });

  
  return (
    <div>
      {user ? (
        <Router>
          {user.role === "ADMIN" ? (
            <AdminNavbar onLogout={handleLogout} />
          ) : user.role === "STORE" ? (
            <StoreNavbar onLogout={handleLogout} />
          ) : (
            <p>Invalid role</p>
          )}
  
          <Routes>
            {/* Admin Routes */}
            {user.role === "ADMIN" && (
              <>
                <Route path="/" element={<OrdersAdmin host={host} localevalue={value} locale={locale} />} />
                <Route path="/listProducts" element={<ListProductsAdmin host={host} localevalue={value} locale={locale} />} />
                <Route path="/addproduct" element={<AddProducts host={host} />} />
                <Route path="/employees" element={<Employees host={host} />} />
                <Route path={`/editproductadmin/:id`} element={<EditProductsAdmin host={host} />} />
                <Route path="/downloadRecords" element={<DownloadWindow host={host} />} />
                <Route path="/settings" element={<Settings SGST={SGST} CGST={CGST} upiid={upiId} host={host} servicetax={serviceTax}/>} />
                <Route path="/reviews" element={<Reviews host={host} />} />
              </>
            )}
  
            {/* Store Routes */}
            {user.role === "STORE" && (
              <>
                <Route path="/" element={<Orders host={host} date={today} localevalue={value} locale={locale} />} />
                <Route path="/productslist" element={<ListProducts host={host} localevalue={value} locale={locale} />} />
                <Route path="/userhome" element={<UserHome user={user.id || 10000} options={setOption} setContact={setContact} contact={contact} setOrderNo={setOrderNo} setUser={setUser} setToday={setToday}/>} />
                <Route path={`/editproducts/:id`} element={<EditProducts />} />
                <Route path="/menu" element={<Products host={host} userId={user.id || 10000} option={option} localevalue={value} locale={locale} cartCount={cartCount} setCartCount={setCartCount} />} />
                <Route path="/cart" element={<Cart host={host} orderNo={orderNo} today={today} userId={user.id || 10000} contact={contact} localevalue={value} locale={locale} option={option} currency={currency} SGST={SGST} CGST={CGST} serviceTax={serviceTax} cartCount={cartCount} setCartCount={setCartCount}/>} />
                <Route path="/thanks/:orderNo/:tableNo/:amount" element={<ThanksPage/>} />
                <Route path="/QRCode/:totalAmount" element={<QRCode upiId={upiId} contact={contact} date={today} locale={locale} />} />
                <Route path="/invoice" element={<Invoice host={host} Order={orderNo} date={today} localevalue={value} locale={locale}/>}/>
              </>
            )}
          </Routes>
        </Router>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
  


  // return (
  //   <div>
  //     {name ? (
  //       <AdminDashboard SGST={SGST} CGST={CGST} upiId={upiId} host={host} adminName={name} onLogout={handleLogout} localization={localization} value={value} locale={locale}/>
  //     ) : (
  //       <AdminLogin onLogin={handleLogin}/>
  //     )}
  //   </div>
  // );




  // const [store, setStore] = useState(null);
  // const handleStoreLogin = (name) => {
  //   setStore(name);
  // };
  // useEffect(()=>{
  //   document.title="Restaurent-App - STORE"; 
  // })
  // const handleStoreLogout = () => {
  //   setStore(null);
  // };

  // return (
  //   <div>
  //     {store ? (
  //       <StoreDashboard host={host} upiId={upiId} currency={currency} SGST={SGST} CGST={CGST}  onLogout={handleStoreLogout} localization={localization} value={value} locale={locale}/>
  //     ) : (
  //       <StoreLogin onLogin={handleStoreLogin}/>
  //     )}


  //   </div>
  // );

};
export default App;