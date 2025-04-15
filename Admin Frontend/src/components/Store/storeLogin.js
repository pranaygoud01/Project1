import React, { useState } from 'react';

const StoreLogin = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Validate admin credentials (you should replace this with your actual authentication logic)
    if (name === 'store' && password === 'password') {
      onLogin(name);
    } else {
      alert('Invalid credentials');
    }
  };

  return (<div>
    <div className='container shadow col-lg-6 my-5' style={{textAlign:'center',background:"linear-gradient(to right, #ff7e5f, #feb47b, #ffefa1)"}}>
      <h2>Store Login</h2><form className='col-lg-6 mx-auto'>
      <div className='form-label my-2'><label>Store Id</label>
      <input
        type="text"
        placeholder="Name"
        className='form-control'
        value={name}
        onChange={(e) => setName(e.target.value)}
      /></div>
      <div><label className='form-label my-2'>Password</label>
      <input
        type="password"
        placeholder="Password"
        className='form-control'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /></div>
      <button className='btn btn-info my-4' onClick={handleLogin}>Login</button></form>
    </div></div>
  );
};

export default StoreLogin;