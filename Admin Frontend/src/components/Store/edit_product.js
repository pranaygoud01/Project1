import React, { useEffect, useState } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link,useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditProducts() {
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [sku, setSKU] = useState();
  const [description, setDescription] = useState();

  const {id}=useParams();

  let navigate=useNavigate();
  
  useEffect(()=>{
    loadProduct();
  },[sku]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product update...");
  
    if (!sku) {
      console.error("SKU is missing!");
      return;
    }
  
    const product = { price, sku, name, description };
  
    try {
      const response = await axios.put(`http://localhost:8080/product/${product.sku}`, product, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Response:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error.response ? error.response.data : error.message);
    }
  };
  

  const loadProduct=async()=>{
    const result=await axios.get(`http://localhost:8080/product/${id}`,id);
    console.log(result.data);
    setSKU(result.data.sku);
    setName(result.data.name);
    setPrice(result.data.price);
    setDescription(result.data.description);
  }


  return (
    <div className='conatiner col-md-6 offset-md-3 border rounded p-4 mt-2 shadow shadebackground'>
      <div style={{textAlign:'right'}}><button className="border" onClick={()=>navigate('/productslist')}><b style={{color:'red'}}>X</b></button></div>
      <h1 className='text-center m-4'>Edit Product</h1>
      <form onSubmit={handleSubmit} autoComplete='off'>
      <div className='mb-4'>
            <label htmlFor="name" className='form-label'>Name</label>
            <input
            type="text"
            id="name"
            name="name"
            className='form-control'
            placeholder='Enter product name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          /></div>
       <div className='mb-4'>
            <label htmlFor="price" className='form-label'>Price</label>
            <input
            type="text"
            id="price"
            name="price"
            className='form-control'
            placeholder='Price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          /></div>
       <div className='mb-4'>
            <label htmlFor="description" className='form-label'>Description</label>
            <textarea
            id="description"
            name="description"
            className='form-control'
            placeholder='Product Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /></div>
          
          <div className='mb-4'>
            <label htmlFor="sku" className='form-label'>SKU</label>
            <input
            type="text"
            id="sku"
            name="sku"
            className='form-control'
            placeholder='Stock Keeping Unit'
            value={sku}
            onChange={(e) => setSKU(e.target.value)}
          /></div>
        <div className='mb-4'><button className="submit form-control btn btn-primary" type="submit" >Submit</button>
        <Link to={"/"} className='form-control btn btn-outline-danger mt-3'>Cancel</Link></div>
             
      </form>
    </div>
  );
};