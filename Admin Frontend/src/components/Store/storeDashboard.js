import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import EmpNavbar from "./empNavbar";
import Products from "./products";
import ListProducts from "./list_products";
import EditProducts from "./edit_product";
import Orders from "./orders";
import { useState,useEffect } from "react";
import UserHome from "./userHome";
import Cart from "./cart";
import QRCode from "./QRCode";
import ThanksPage from "./thankspage";
import Invoice from "./invoice";

const StoreDashboard=({host,upiId,currency,SGST,CGST,localization,locale,value,onLogout})=>{
    const [option,setOption]=useState('dine-in');
    const [contact,setContact]=useState();

    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const [orderNo, setOrderNo] = useState(() => { return parseInt(localStorage.getItem('renderStoreCount')) || 110000; });
    const [user,setUser]=useState(() => { return parseInt(localStorage.getItem('userId')) || 10000; });
  
  // useEffect(() => {
  //   setUser((prevCount)=>{
  //     if(prevCount){
  //       const newuser =prevCount + 1;
  //       localStorage.setItem('userId', newuser);
  //       return newuser;
  //     }
  //     else{
  //       localStorage.setItem('userid', 10000);
  //       return 10000;
  //     }
  //   });
  //   setOrderNo((prevCount) => {
  //         const currentDate = new Date().toISOString().split('T')[0];
    
  //         const storedDate = new Date(localStorage.getItem('date')).toISOString().split('T')[0];
    
  //         if (storedDate && (currentDate === storedDate)) {
  //             const newCount =prevCount + 1;
  //             localStorage.setItem('renderStoreCount', newCount);
  //             setToday(new Date(storedDate).toISOString().split('T')[0]);
  //             return newCount;
  //         } else {
  //             localStorage.setItem('date', currentDate);
  //             localStorage.setItem('renderStoreCount', 110000);
  //             setToday(new Date(currentDate).toISOString().split('T')[0]);
  //             return 110000;
  //         }
  //     })
  // }, []);
    return  <div>
    <Router>
        <EmpNavbar localization={localization} onLogout={onLogout}/>
        <Routes>
            <Route path='/productslist' element={<ListProducts host={host} localevalue={value} locale={locale}/>}/>
            <Route path='/' element={<Orders host={host} date={today} localevalue={value} locale={locale}/>}/>
            <Route path='/userhome' element={<UserHome  options={setOption} setContact={setContact} contact={contact} setOrderNo={setOrderNo} setUser={setUser} setToday={setToday}/>}/>
            <Route path={`/editproducts/:id`} element={<EditProducts />}/>
            <Route path="/menu" element={<Products host={host} userId={user} option={option} localevalue={value} locale={locale}/>}/>
            <Route path='/cart' element={<Cart host={host} orderNo={orderNo} today={today} userId={user} contact={contact} localevalue={value} locale={locale} option={option} currency={currency} SGST={SGST} CGST={CGST}/>}/>
            <Route path='/thanks/:orderNo/:tableNo/:amount' element={<ThanksPage/>}/>
            <Route path='/QRCode/:totalAmount' element={<QRCode upiId={upiId} contact={contact} date={today} locale={locale}/>}/>
            <Route path='/invoice' element={<Invoice Order={orderNo} date={today} localevalue={value} locale={locale}/>}/>
        </Routes>
    </Router>
    
  
</div>
}
export default StoreDashboard;