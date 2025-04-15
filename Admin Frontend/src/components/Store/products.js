import React, { useState, useEffect } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../CSS/App.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa"; // Importing FontAwesome icon
import Modal from './Modalwindow';

export default function Products({ host, userId, option, localevalue, locale ,cartCount,setCartCount}) {
  const [products, setProducts] = useState([{
    name: '',
    price: '',
    description: '',
    sku: '',
    hold: '',
    discount: '',
    quantity: 1,
    addOn: ''

  }]);

  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

    const openModal = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

  const addtocart = (product) => {
    fetch(`${host}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, userId: userId })
    })
    setCartCount(cartCount + 1);
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
  const handleAddOn = (id, value) => {
    const updatedproduct = products.map(item => {
      if (item.sku === id) {
        return { ...item, addOn: value };
      }
      return item;

    });
    setProducts(updatedproduct);
  };
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

  const [displayText, setDisplayText] = useState('');

  const handleClick = () => {
    setDisplayText('Button clicked!');
    setTimeout(() => {
      setDisplayText('');
    }, 1000); // Display text for 3 seconds
  };


  // useEffect(()=>{
  //   fetch(`${host}/allproducts`)
  //   .then(res=>res.json())
  //   .then((result)=>setProducts(result));

  //   const updatedproduct=products.map(item => {
  //     return { ...item, quantity: 1 };
  // });
  // setProducts(updatedproduct);
  //   console.log('true')
  // },[])

  useEffect(() => {
    setCartCount(0);
    const response = axios.get(`${host}/allproducts`);
    response.then((response) => {
      setProducts(response.data);
      console.log(response.data);
    })
    // setTimeout(()=>updatequantity(),1000);

  }, [option])

  const updatequantity = () => {
    const updatedproduct = products.map(item => {
      return { ...item, quantity: 1 };
    });
    setProducts(updatedproduct);
  }

  return (<div><h2 style={{ textAlign: 'center' }}>Menu</h2>
    <div className={`menu-page ${selectedProduct ? 'blurred' : ''} container d-flex`} style={{flexDirection:'column'}}>
      {Object.entries(products.reduce((acc, product) => {
        const { category } = product;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {})).map(([category, items]) => (
        <div key={category} className="d-flex" style={{flexDirection:'column'}}>
          <h2>{category}</h2>
          {items.map((product) => (
            <div key={product.sku} className="container-fluid product-item  d-flex col-10 shadow my-2 py-2 w-100">
              <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} className="product-image col-3 mx-3" style={{borderRadius:'8px',maxHeight:'200px'}} />
              <div className="product-details col-6" onClick={()=>openModal(product)}>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-pricing">
                  {product.discount ? (
                    <>
                      <span className="original-price">{locale}<del>{product.price}</del></span>
                      <span className="discount-price">   <b>{locale}{(product.price - product.price * product.discount / 100).toFixed(0)}</b></span>
                    </>
                  ) : (
                    <span className="price">{locale} {product.price}</span>
                  )}
                </div>
              </div>
              <div className='d-flex col-3' style={{ flexDirection: 'column' }}>
                <input type='number' className='mx-auto' value={product.quantity} min={1} onChange={(e) => updateQuantity(product.sku, parseInt(e.target.value))} />
                <button className='btn btn-warning w-50' onClick={() => { addtocart(product); handleClick() }}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      ))}
  </div >
  <div className='d-flex' style={{ position: 'fixed', bottom: '30px',left:'45%'}}>
    <button onClick={() => navigate("/cart")} className='gotocart btn btn-lg btn-outline-dark bg-warning'>Go to Cart</button>
      <div className='carticon' style={{ position: "absolute", left: '120px', top: '17px' }}>
        <FaShoppingCart className="mx-3 carticon" onClick={() => navigate("/cart")} style={{ color: "blue", fontSize: '35px' }} />
        {cartCount?
          <span className="bg-danger cartcount" style={{
            position: "relative",
            top: -50,
            left:45,
            color: 'white',
            borderRadius: "50%",
            padding: "5px",
            fontSize: "10px"
          }}>
            {cartCount}
          </span>
        :''}
      </div>
    </div>
    {selectedProduct && (
                <Modal product={selectedProduct} onClose={closeModal} locale={locale}/>
            )}
  </div>);
  // return (
  //   <div className="background app">
  //     <h1 className='pt-5 mb-3' style={{ color: '#ef9a32' }}>Restaurant Menu</h1>
  //     <div className="menu pb-5">

  //       {products.map((product, index) => (
  //         <div key={index} className={product.hold?"d-none":"product-card"}>
  //           <h3>{product.name}</h3>
  //           <p  style={{textAlign:'center'}}>Price: <b>{locale}</b> {product.discount>0?<del>{(localevalue * (product.price)).toFixed(0)}</del>:(localevalue * (product.price)).toFixed(0)} {product.discount>0? <p><b>{(product.price-((product.price*product.discount)/100)).toFixed(0)}</b></p>:''}</p>
  //           <p>Description: {product.description}</p>
  //           <div className='d-flex'><p className='my-auto'>Select quantity : </p>
  //             <input
  //               htmlFor={product.quantity}
  //               type="number"
  //               min={1}
  //               value={product.quantity} onChange={(e) => updateQuantity(product.sku, parseInt(e.target.value))}
  //             /></div><br />
  //             <div>
  //           <label>
  //             <input
  //               type="checkbox"
  //               checked={addOn[product.productId]?.isChecked || false}
  //               onChange={() => handleCheckboxChange(product.productId)}
  //             />
  //             Add add-ons
  //           </label>
  //           {addOn[product.productId]?.isChecked && (
  //             <textarea
  //               rows="2"
  //               cols="20"
  //               value={products.addOn}
  //               onChange={(e) => handleAddOn(product.sku, e.target.value)}
  //               placeholder="Enter your add-ons here"
  //             />
  //           )}
  //             </div>
  //           <button className='btn btn-primary' onClick={() => { addtocart(product); handleClick() }}>Add to cart</button>{displayText && <p>{displayText}</p>}
  //         </div>
  //       ))}
  //       <div className='' style={{position:'fixed',bottom:'30px'}}><Link to={'/cart'}><button className='btn btn-lg btn-outline-dark bg-warning'>Go to Cart</button></Link></div>
  //     </div>
  //   </div>
  // );
};

