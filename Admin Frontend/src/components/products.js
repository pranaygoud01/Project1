import React, { useState, useEffect } from 'react';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../CSS/App.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Products({ host,userId, option, localevalue, locale }) {
  const [products, setProducts] = useState([{
    name: '',
    price: '',
    description: '',
    sku: '',
    hold: '',
    quantity: 1,
    addOn:''
  }]);

  const [addOn, setAddOn] = useState({});

  const handleCheckboxChange = (id) => {
    setAddOn(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        isChecked: !prevState[id]?.isChecked,
      },
    }));
  };

  const handleAddOn = (id, value) => {
    const updatedproduct = products.map(item => {
      if (item.sku === id) {
        return { ...item, addOn: value };
      }
      return item;

    });
    setProducts(updatedproduct);
    console.log(products)
  };

  const addtocart = (product) => {
    fetch(`${host}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, userId: userId})
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    const updatedproduct = products.map(item => {
      if (item.sku === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;

    });
    setProducts(updatedproduct);

  };

  const [displayText, setDisplayText] = useState('');

  const handleClick = () => {
    setDisplayText('Button clicked!');
    setTimeout(() => {
      setDisplayText('');
    }, 1000); // Display text for 3 seconds
  };

  useEffect(() => {
    const response = axios.get(`${host}/allproducts`);
    response.then((response) => {
      setProducts(response.data);
    })
    // setTimeout(()=>updatequantity(),1000);

  }, [option])

  const updatequantity = () => {
    const updatedproduct = products.map(item => {
      return { ...item, quantity: 1 };
    });
    setProducts(updatedproduct);
    console.log(products);
  }

  return (
    <div className="background app">
      <h1 className='pt-5 mb-3' style={{ color: '#ef9a32' }}>Restaurant Menu</h1>
      <div className="menu pb-5">

        {products.map((product, index) => (
          <div key={index} className={product.hold ? "d-none" : "product-card"}>
            <h3>{product.name}</h3>
            <p>Price: <b>{locale}</b> {(localevalue * (product.price)).toFixed(2)}</p>
            <p>Description: {product.description}</p>
            <div className='d-flex'><p className='my-auto'>Select quantity : </p>
              <input
                htmlFor={product.quantity}
                type="number"
                min={1}
                value={product.quantity} onChange={(e) => updateQuantity(product.sku, parseInt(e.target.value))}
              />
            </div><br />
            <div>
            <label>
              <input
                type="checkbox"
                checked={addOn[product.productId]?.isChecked || false}
                onChange={() => handleCheckboxChange(product.productId)}
              />
              Add add-ons
            </label>
            {addOn[product.productId]?.isChecked && (
              <textarea
                rows="2"
                cols="20"
                value={products.addOn}
                onChange={(e) => handleAddOn(product.sku, e.target.value)}
                placeholder="Enter your add-ons here"
              />
            )}
              </div>
            <button className='btn btn-primary' onClick={() => { addtocart(product); handleClick() }}>Add to cart</button>{displayText && <p>{displayText}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

