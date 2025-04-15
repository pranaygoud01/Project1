import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { useState,useEffect } from 'react';
import axios from 'axios';
import HomePage from './components/homePage';
import Menu from './components/menu';
import Cart from './components/cart';
import Navbar from './components/navbar';
import ThanksPage from "./components/thanksPage";
import AppProvider from './ContextAPI/userdata';
import Invoice from './components/invoice';
import Login from './components/login';
import CheckoutForm from './components/CheckoutForm';
import PaymentPage from './PaymentPage'; 
import { PaymentSuccessPage,PaymentFailedPage } from './components/CheckoutForm';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/thanks" element={<ThanksPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/checkout/:orderId" element={<CheckoutForm />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failed" element={<PaymentFailedPage />} />
            <Route path="/invoice" element={<Invoice />} />
          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

export default App
