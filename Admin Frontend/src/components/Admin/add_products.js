import React, { useState } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from 'react-router-dom';
import "../../CSS/App.css";
import axios from "axios";

export default function AddProducts({ host }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSKU] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState();
  const hold = false;
  const discount = 0;

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = { category, price, sku, name, description, hold, discount, image }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('category', category);
    formData.append('sku', sku);
    formData.append('discount', discount);
    formData.append('hold', hold);
    console.log(image);
    try {
      const response = await axios.post(`${host}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading product:', error);
    }
    setName('');
    setPrice('');
    setSKU('');
    setDescription('');
    setCategory('');
    setImage(null);
    navigate("/");
  };

  const encodeImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };



  return (<div className='addproduct  pt-3 pb-3'>
    <div className='conatiner col-md-6 offset-md-3 border rounded p-4 shadow shadebackground'>
      <div style={{ textAlign: 'right' }}><button className="border" onClick={() => navigate("/")}><b style={{ color: 'red' }}>X</b></button></div>
      <h1 className='text-center m-4'>Add Product</h1>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <div className='mb-4'>
          <label htmlFor="name" className='form-label'>Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className='form-control'
            placeholder='Enter product category'
            value={category} required
            onChange={(e) => setCategory(e.target.value)}
          /></div>
        <div className='mb-4'>
          <label htmlFor="name" className='form-label'>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className='form-control'
            placeholder='Enter product name'
            value={name} required
            onChange={(e) => setName(e.target.value)}
          /></div>
        <div className='mb-4'>
          <label htmlFor="price" className='form-label'>Price</label>
          <input
            type="text"
            id="price"
            name="price"
            className='form-control'
            placeholder='Price in pounds'
            value={price} required
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
            value={sku} required
            onChange={(e) => setSKU(e.target.value)}
          /></div>
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />{image ? <img src={image} height={40} width={40} /> : ''}
        </div>
        <div className='mb-4'><button className="submit form-control btn btn-primary" type="submit">Submit</button>
          <Link to={"/"} className='form-control btn btn-outline-danger mt-3'>Cancel</Link></div>

      </form>
    </div></div>
  );
};
