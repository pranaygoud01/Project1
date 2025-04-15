import React, { useEffect, useState } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditProductsAdmin({ host }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSKU] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const hold = false;
  const discount = 0;

  const { id } = useParams(); // sku is passed as "id" from route param
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const result = await axios.get(`${host}/product/${id}`);
      const product = result.data;

      setSKU(product.sku);
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setImagePreview(`${host}/images/${product.image}`); // Assuming image name stored in DB
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('discount', discount);
    formData.append('hold', hold);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(`${host}/product/${sku}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Updated:', response.data);
      navigate("/");
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className='container col-md-6 offset-md-3 border rounded p-4 mt-2 shadow shadebackground'>
      <div style={{ textAlign: 'right' }}>
        <button className="border" onClick={() => navigate('/')}>
          <b style={{ color: 'red' }}>X</b>
        </button>
      </div>
      <h1 className='text-center m-4'>Edit Product</h1>
      <form onSubmit={handleSubmit} autoComplete='off'>
        
        <div className='mb-4'>
          <label htmlFor="category" className='form-label'>Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className='form-control'
            placeholder='Enter product category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

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
            required
          />
        </div>

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
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="description" className='form-label'>Description</label>
          <textarea
            id="description"
            name="description"
            className='form-control'
            placeholder='Product Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label className='form-label'>Image</label>
          <input type="file" className='form-control' onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" height={60} width={60} className='mt-2' />}
        </div>

        <div className='mb-4'>
          <button className="btn btn-primary form-control" type="submit">Update</button>
          <Link to="/" className="btn btn-outline-danger form-control mt-3">Cancel</Link>
        </div>

      </form>
    </div>
  );
}
