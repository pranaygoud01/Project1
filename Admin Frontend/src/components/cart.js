import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Invoice from './invoice';
import Payment from './payment';
import { useNavigate } from 'react-router-dom';

function Cart({host,orderNo,today,contact,userId,option,localevalue, locale, currency, SGST, CGST }) {
    // State for storing cart items
    const [cart, setCart] = useState([{
        name: '',
        price: '',
        description: '',
        sku: '',
        quantity: 1,
        addOn:''
        ,userId:'',
        accepted:''
    }]);
    const [amount, setamount] = useState();
    const [tableNo,setTableNo]=useState('');
    const [view,setView]=useState('cart');

    const navigate=useNavigate();


    var element = 0;
    var updateproduct;
    let TotalAmount = ((((SGST + CGST) / 100) * amount) + amount);


    let order={
        orderNo: orderNo,
        date: today,
        amount: amount,
        contact:contact,
        mode:option+' '+tableNo,
        sgst: SGST,
        cgst: CGST,
        totalAmount: TotalAmount,
        paymentMode:'Not paid',
        orderAccept:false,
        cart: cart
    }
 



    useEffect(() => {
        fetchData();
    }, [updateproduct, cart,order]);

    const fetchData = async () => {
        const response = await axios.get(`${host}/cart/${userId}`);
        setCart(response.data);
        setamount(sum(cart));
    }
    const postdata = async () => {
        const response=await axios.post(`${host}/orders`, order);
        order=response.data;
    }
    const updatepostdata = async () => {
        await axios.put(`${host}/orders/${orderNo}`, order);
    }

    const deleteProduct = async (cartId) => {
        await axios.delete(`${host}/cart/${cartId}`);
    }

    const sum = (cart) => {
        for (let index = 0; index < cart.length; index++) {
            element = element + (cart[index].price * cart[index].quantity);
        }
        return element;
    }

    // Function to update the quantity of a product in the cart
    const updateQuantity = async (productId,user, newQuantity) => {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].sku === productId) {
                updateproduct = { ...cart[i], quantity: newQuantity };

            }
        }
        if (updateproduct != null) {
            await axios.put(`${host}/cart/${user}/${productId}`, updateproduct);
        }

    };

    const updateAddOn = async (sku,user, value) => {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].sku === sku) {
                updateproduct = { ...cart[i], addOn: value };

            }
        }
        if (updateproduct != null) {
            await axios.put(`${host}/cart/${user}/${sku}`, updateproduct);
        }

    };

    const cartNextButton=()=>{
        postdata();
        setView('invoice');
    }
    const placeOrderButton = async() => {
        console.log(cart)
        const updatedData = cart.map(item => {
            axios.put(`${host}/cart/${userId}/${item.sku}`,{...item,accepted:true})
            return ({...item,accepted: true})
    });
        order.cart=updatedData;
        postdata();
        navigate(`/thanks/${orderNo}/${tableNo}/${order.totalAmount}`)
    };




    // Function to render the cart items
    const renderCartItems = () => {
       
        const dineInTbl=()=>{
            return <div className='container d-flex my-4' style={{justifyContent:'center',fontSize:'1.25rem'}}><div className='border'><label for='tableNo'>Select Table</label>
            <select id='tableNo' value={tableNo} required onChange={(e)=>setTableNo(e.target.value)}>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='6'>6</option>
                <option value='7'>7</option>
                <option value='8'>8</option>
                <option value='9'>9</option>
            </select>
            </div></div>
        }
        return (<div className='container shadow'>
            {option==='dine-in'?dineInTbl():''}
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Add Ons</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => {
                        return <>
                            <tr>
                                <td>{item.name}</td>
                                <td>{locale} {(localevalue * (item.price)).toFixed(2)}</td>
                                {/* <td>{item.quantity}</td> */}
                                <td><form><input htmlFor={item.quantity}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => item.accepted?'':updateQuantity(item.sku,item.userId, parseInt(e.target.value))}
                                /></form></td>
                                <td>{locale} {(item.quantity * item.price * localevalue).toFixed(2)}</td>
                                <td><textarea value={item.addOn} onChange={(e)=>item.accepted?'':updateAddOn(item.sku,item.userId,e.target.value)}/></td>
                                <td><button className={item.accepted?"btn btn-danger disabled":"btn btn-danger"} onClick={() => deleteProduct(item.cartId)}> Remove</button></td>
                            </tr></>
                    })}
                    </tbody>
            </table>
            <table className="table text-center">
                <tbody>
                    <tr><td></td><td colSpan={2}><b>Amount</b></td>
                    <td><h5 >{locale} {(amount * localevalue).toFixed(2)}</h5 ></td><td> </td></tr>
                    <tr><td></td><td colSpan={2}><b>SGST - {SGST}%</b></td>
                    <td><h6>{locale} {((SGST/100)*amount * localevalue).toFixed(2)}</h6></td><td> </td></tr>
                    <tr><td></td><td colSpan={2}><b>CGST - {CGST}%</b></td>
                    <td><h6>{locale} {((CGST/100)*amount * localevalue).toFixed(2)}</h6></td><td> </td></tr>
                    <tr><td></td><td colSpan={2}><b>Total Amount</b></td>
                    <td><h4>{locale} {(((((CGST+SGST)/100)*amount)+amount) * localevalue).toFixed(2)}</h4></td><td> </td></tr>
                </tbody>
            </table>
                
            <div style={{ textAlign: 'center' }}>
                <button className="btn btn-warning btn-lg mx-auto mb-4" onClick={() => {(option==='take-away')?cartNextButton():(tableNo)?placeOrderButton():alert("Select your Table")}}>{(option==='dine-in')?'Place Order':'Next'}</button>
            </div></div>)

    };
    
    const displayCart=()=>{
        return <>
        <h2 className='container pt-5 mb-3'>Cart</h2>
            {cart.length === 0 ? <div className='container border border-warning'><p className='my-auto' style={{ textAlign: 'center' }}>Your Cart is empty</p></div> : renderCartItems()}
</>}
   
    

    return (<div className='cart'>
        <div className='container pb-5'>
            {(view==='payment')?<Payment order={orderNo} amount={order.totalAmount} currency={currency} locale={locale} setview={setView}/>:(view==='invoice')?<Invoice Order={orderNo}/* cart={cart}*/ date={today} localevalue={localevalue} locale={locale} setview={setView}/>:displayCart()}
        </div>
    </div>
    );
}

export default Cart;
