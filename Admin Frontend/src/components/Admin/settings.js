// import { useEffect, useState } from "react";
// import axios from "axios";


// const Settings = ({ SGST, CGST, upiid, servicetax, host }) => {
//     const [sgst, setsgst] = useState();
//     const [cgst, setcgst] = useState();
//     const [upiId, setUpiId] = useState();
//     const [serviceTax, setServiceTax] = useState();

//     const [n, setN] = useState();
//     const [discount, setDiscount] = useState();
//     const [expDate, setExpDate] = useState();
//     const [length, setLength] = useState();

//     const [promoCodes, setPromoCodes] = useState();

//     useEffect(() => {
//         setcgst(CGST);
//         setsgst(SGST);
//         setUpiId(upiid);
//         setServiceTax(servicetax);
//         try {
//             axios.get(`${host}/promo/getall`)
//                 .then((result) => {
//                     setPromoCodes(result.data)
//                 })
//         } catch {
//             console.log('Error fetching promoCodes');
//         }
//     }, [SGST, CGST, upiid, servicetax, promoCodes])


//     const generatePromoCodes = () => {
//         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//         console.log(n, expDate, discount)
//         for (let j = 0; j < n; j++) {
//             let result = 'VIN';
//             for (let i = 0; i < length - 3; i++) {
//                 result += characters.charAt(Math.floor(Math.random() * characters.length));
//             }
//             try {
//                 axios.post(`${host}/promo/add`, { promoCode: result, used: false, expDate: expDate, discount: discount });
//             } catch {
//                 console.log('Error posting promocode');
//             }

//         }
//     };

//    /* const deletePromoCodes = () => {
//         promoCodes.map((promocode) => {
//             try {
//                 console.log(promocode)
//                 axios.delete(`${host}/promo/delete`, { promoCode:promocode.promoCode,discount:promocode.discount,used:promocode.used,expDate:promocode.expDate });
//             } catch {
//                 console.log('Error posting promocode');
//             }
//         })

//     };
//     */
//     const deletePromoCode = async (code) => {
//         try {
//           await axios.delete(`${host}/promo/delete`, {
//             data: { promoCode: code }
//           });
//           setPromoCodes(prev => prev.filter(p => p.promoCode !== code));
//         } catch (error) {
//           console.error("Error deleting promo code:", error);
//         }
//       };
      


//   {/*  return<div className="container">
//         {/*<label>SGST : <input type="number" className="form-label" value={sgst} onChange={(e) => { setsgst(e.target.value) }} /><button className="btn-sm bg-success" onClick={() => axios.post(`${host}/settings/sgst/${sgst}`)}>submit</button></label>
//         <label>CGST : <input type="number" value={cgst} onChange={(e) => { setcgst(e.target.value) }} /><button className="btn-sm bg-success" onClick={() => axios.post(`${host}/settings/cgst/${cgst}`)}>submit</button></label>
//         <label>Upi Id : <input type="text" value={upiId} onChange={(e) => { setUpiId(e.target.value) }} /><button className="btn-sm bg-success" onClick={() => axios.post(`${host}/settings/upiid/${upiId}`)}>submit</button></label>
//         <label>Service Charges : <input type="number" value={serviceTax} onChange={(e) => { setServiceTax(e.target.value) }} /><button className="btn-sm bg-success" onClick={() => axios.post(`${host}/settings/serviceTax/${serviceTax}`)}>submit</button></label>
        
//         <div>
//             <div>Generate promoCodes</div>
//             <label>no. of codes<input type="number" name="n" onChange={(e) => setN(e.currentTarget.value)} /></label>
//             <label>code length<input type="number" name="length" onChange={(e) => setLength(e.currentTarget.value)} /></label>
//             <label>Discount<input type="number" name="discount" onChange={(e) => setDiscount(e.currentTarget.value)} /></label>
//             <label>Exp Date<input type="date" name="expDate" onChange={(e) => setExpDate(e.currentTarget.value)} /></label>
//             <button className="btn btn-warning" onClick={() => generatePromoCodes()}>Generate</button>
//             <button className="btn btn-danger" onClick={() => deletePromoCodes()}>Delete All</button>
//         </div>
//         {promoCodes && promoCodes.map(promoCode => {
//             return <tr><td className="table-cell">{promoCode.promoCode}</td><td className="table-cell">{promoCode.discount}</td><td className="table-cell">{promoCode.expDate}</td><td className="table-cell">{promoCode.used}</td></tr>
//         })}

//     </div>
//     */}
//     return (
//         <div className="container mt-5">
//           <h3 className="mb-4">Generate Promo Codes</h3>
//           <div className="row g-3 mb-4">
//             <div className="col-md-3">
//               <label className="form-label">No. of Codes</label>
//               <input type="number" className="form-control" onChange={(e) => setN(e.currentTarget.value)} />
//             </div>
//             <div className="col-md-3">
//               <label className="form-label">Code Length</label>
//               <input type="number" className="form-control" onChange={(e) => setLength(e.currentTarget.value)} />
//             </div>
//             <div className="col-md-3">
//               <label className="form-label">Discount (%)</label>
//               <input type="number" className="form-control" onChange={(e) => setDiscount(e.currentTarget.value)} />
//             </div>
//             <div className="col-md-3">
//               <label className="form-label">Expiry Date</label>
//               <input type="date" className="form-control" onChange={(e) => setExpDate(e.currentTarget.value)} />
//             </div>
//           </div>
      
//           <div className="mb-4">
//             <button className="btn btn-warning me-2" onClick={generatePromoCodes}>Generate</button>
//           </div>
      
//           <h4 className="mb-3">Existing Promo Codes</h4>
//           {promoCodes && promoCodes.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>Promo Code</th>
//                     <th>Discount (%)</th>
//                     <th>Expiry Date</th>
//                     <th>Used</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {promoCodes.map((promoCode, index) => (
//                     <tr key={index}>
//                       <td>{promoCode.promoCode}</td>
//                       <td>{promoCode.discount}</td>
//                       <td>{promoCode.expDate}</td>
//                       <td>{promoCode.used ? "Yes" : "No"}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => deletePromoCode(promoCode.promoCode)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No promo codes available.</p>
//           )}
//         </div>
//       );
      
// }
// export default Settings;


import { useEffect, useState } from "react";
import axios from "axios";

const Settings = ({ SGST, CGST, upiid, servicetax, host }) => {
  const [sgst, setsgst] = useState();
  const [cgst, setcgst] = useState();
  const [upiId, setUpiId] = useState();
  const [serviceTax, setServiceTax] = useState();

  const [n, setN] = useState();
  const [discount, setDiscount] = useState();
  const [expDate, setExpDate] = useState();
  const [length, setLength] = useState();

  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    setcgst(CGST);
    setsgst(SGST);
    setUpiId(upiid);
    setServiceTax(servicetax);

    axios.get(`${host}/promo/getall`)
      .then((result) => {
        setPromoCodes(result.data);
      })
      .catch(() => {
        console.log('Error fetching promoCodes');
      });
  }, [SGST, CGST, upiid, servicetax]);

  const generatePromoCodes = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let j = 0; j < n; j++) {
      let result = 'VIN';
      for (let i = 0; i < length - 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      try {
        const res = await axios.post(`${host}/promo/add`, {
          promoCode: result,
          used: false,
          expDate,
          discount
        });
        console.log("Posted promo code:", res.data);
      } catch (error) {
        console.error('Error posting promocode:', error.response?.data || error.message);
      }
    }

    // Refresh promo list after generation
    try {
      const result = await axios.get(`${host}/promo/getall`);
      setPromoCodes(result.data);
    } catch {
      console.log('Error refreshing promoCodes');
    }
  };

  const deletePromoCode = async (code) => {
    try {
      await axios.delete(`${host}/promo/delete`, {
        data: { promoCode: code }
      });
      setPromoCodes(prev => prev.filter(p => p.promoCode !== code));
    } catch (error) {
      console.error("Error deleting promo code:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Generate Promo Codes</h3>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">No. of Codes</label>
          <input type="number" className="form-control" onChange={(e) => setN(e.currentTarget.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Code Length</label>
          <input type="number" className="form-control" onChange={(e) => setLength(e.currentTarget.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Discount (%)</label>
          <input type="number" className="form-control" onChange={(e) => setDiscount(e.currentTarget.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Expiry Date</label>
          <input type="date" className="form-control" onChange={(e) => setExpDate(e.currentTarget.value)} />
        </div>
      </div>

      <div className="mb-4">
        <button className="btn btn-warning me-2" onClick={generatePromoCodes}>Generate</button>
      </div>

      <h4 className="mb-3">Existing Promo Codes</h4>
      {promoCodes && promoCodes.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Promo Code</th>
                <th>Discount (%)</th>
                <th>Expiry Date</th>
                <th>Used</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promoCode, index) => (
                <tr key={index}>
                  <td>{promoCode.promoCode}</td>
                  <td>{promoCode.discount}</td>
                  <td>{promoCode.expDate}</td>
                  <td>{promoCode.used ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletePromoCode(promoCode.promoCode)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No promo codes available.</p>
      )}
    </div>
  );
};

export default Settings;
