// import React, { useState } from 'react';

// const Login = ({adminName,adminPassword,storeName,storePassword, onLogin }) => {
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Validate admin credentials (you should replace this with your actual authentication logic)
//     if ((name === adminName && password === adminPassword)||(name===storeName && password===storePassword)) {
//       onLogin(name);
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   return (<div>
//     <div className='container shadow col-lg-6 my-5' style={{textAlign:'center',background:"linear-gradient(to right, #ff7e5f, #feb47b, #ffefa1)"}}>
//       <h2>Login</h2><form className='col-lg-6 mx-auto'>
//       <div className='form-label my-2'><label>Login Name</label>
//       <input
//         type="text"
//         placeholder="Name"
//         className='form-control'
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       /></div>
//       <div><label className='form-label my-2'>Password</label>
//       <input
//         type="password"
//         placeholder="Password"
//         className='form-control'
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       /></div>
//       <button className='btn btn-info my-4' onClick={handleLogin}>Login</button></form>
//     </div></div>
//   );
// };

// export default Login;

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    const { email, password } = formData;
  
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // important to include session cookies
      });
  
      if (response.ok) {
        const userData = await response.json(); // parse JSON from backend
        alert(`Login successful! Welcome, ${userData.name}`);
        
        // Pass user info to App.js
        onLogin(userData); // instead of just email
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };
  

  const handleSignup = async () => {
    // Ensure role is in uppercase
    const dataToSend = {
      ...formData,
      role: formData.role.toUpperCase(),
    };
  
    try {
      const response = await fetch("http://localhost:8080/users", 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await response.text(); // assuming backend sends plain text error
  
      if (response.ok) {
        alert(result); // "User created successfully with ID: ..."
        setIsSignup(false);
        setFormData({ name: '', email: '', password: '', phoneNumber: '', role: '' });
      } else {
        // ✅ Convert technical error into friendly message
        let friendlyMessage = "Signup failed.";
        if (result.includes("admin user already exists")) {
          friendlyMessage = "An admin already exists. Please choose another role.";
        } else if (result.includes("ConstraintViolationException") || result.includes("duplicate")) {
          friendlyMessage = "Email or phone number already exists.";
        } else if (result.includes("could not execute statement")) {
          friendlyMessage = "Invalid details. Please check your input.";
        }
        alert(friendlyMessage);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
      console.error("Signup error:", error);
    }
  };
  
  
  return (
    <div className='container shadow col-lg-6 my-5' style={{ textAlign: 'center', background: "linear-gradient(to right, #ff7e5f, #feb47b, #ffefa1)", padding: '30px', borderRadius: '12px' }}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form className='col-lg-8 mx-auto'>
        <div className='form-label my-2'>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className='form-control'
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        {isSignup && (
          <div className='form-label my-2'>
            <label>Name</label>
            <input
              type="text"
              name="name"
              className='form-control'
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
        )}

        <div className='form-label my-2'>
          <label>Password</label>
          <input
            type="password"
            name="password"
            className='form-control'
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>

        {isSignup && (
          <>
            <div className='form-label my-2'>
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className='form-control'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            <div className='form-label my-2'>
              <label>Role</label>
              <input
                type="text"
                name="role"
                className='form-control'
                value={formData.role}
                onChange={handleChange}
                placeholder="Role"
              />
            </div>
          </>
        )}

        {!isSignup ? (
          <button type="button" className='btn btn-info my-3' onClick={handleLogin}>Login</button>
        ) : (
          <button type="button" className='btn btn-success my-3' onClick={handleSignup}>Sign Up</button>
        )}

        <p className='text-primary'>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          &nbsp;
          <span
            style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
