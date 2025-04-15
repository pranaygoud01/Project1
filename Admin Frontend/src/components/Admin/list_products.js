// import { useEffect, useState } from "react";
// import Axios from "axios";
// import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";
// import "../../CSS/App.css";
// import axios from "axios";


// export default function ListProductsAdmin({ host, localevalue, locale }) {

//     const [products, setProducts] = useState([]);
//     const navigate = useNavigate();

//     const [checked, setChecked] = useState(false)


//     useEffect(() => {
//         fetch(`${host}/allproducts`)
//             .then(res => res.json())
//             .then((result) => setProducts(result))
//     }, [products]);

//     const deleteproduct = async (sku, name) => {
//         if (window.confirm("Delete " + name + " ...?")) {
//             await Axios.delete(`${host}/product/${sku}`);
//         }
//         navigate("/");
//     }

//     const editproduct = (sku) => {
//         navigate(`/editproductadmin/${sku}`);
//     }

//     const holdproduct = (product) => {
//         axios.put(`${host}/products/${product.sku}/hold`)
//             .then(() => {
//                 // Optionally update UI after successful toggle
//                 setProducts(prevProducts =>
//                     prevProducts.map(p =>
//                         p.sku === product.sku ? { ...p, hold: !p.hold } : p
//                     )
//                 );
//             })
//             .catch(error => {
//                 console.error("Error updating hold status:", error);
//             });
//     };
    

//     const handleCheckboxChange = (event) => {
//         setChecked(event.target.checked);

//     };

//     return (<div className="listproducts pt-3 pb-3">
//         <div className="container shadebackground pb-2" >
//             <h1 className="mt-5 mb-3">Products List</h1>
//             <table className="table border shadow text-center" >
//                 <thead>
//                     <tr><th>Name</th>
//                         <th>Price</th>
//                         <th>SKU</th>
//                         {/*<th>Discount-%</th>*/}
//                         <th>Description</th>
//                         <th colSpan={2}>Action</th>
//                     </tr></thead>
//                 <tbody>
//                     {products.map((product, index) => (
//                         <tr>
//                             <td key={index.name}>{product.name}</td>
//                             <td key={index.price}><b>{locale}</b> {(product.price * localevalue).toFixed(2)}</td>
//                             <td key={index.sku}>{product.sku}</td>
//                             {/* <td><input type="number" value={product.discount} pattern="[0-9]{2}" maxLength={2} onChange={(e)=>axios.put(`${host}/product/${product.sku}`,{...product,discount:e.target.value})}/></td>*/}
//                             <td key={index.description}>{product.description}</td>
//                             <td><button className="btn btn-success mx-1 " onClick={() => editproduct(product.sku)}>Edit</button>
//                                 <button className="btn btn-danger mx-1" onClick={() => deleteproduct(product.sku, product.name)}>Delete</button>
//                                 <button
//                                     className={`btn mx-1 ${product.hold ? 'btn-danger' : 'btn-success'}`}
//                                     onClick={() => holdproduct(product)}
//                                 >
//                                     {product.hold ? 'un-hold' : 'hold'}
//                                 </button>

//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div></div>
//     )
// }





import { useEffect, useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../../CSS/App.css";
import axios from "axios";

export default function ListProductsAdmin({ host, localevalue, locale }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${host}/allproducts`)
      .then((res) => res.json())
      .then((result) => setProducts(result))
      .catch((err) => console.error("Error fetching products:", err));
  }, []); // ✅ fetch only on component mount

  const deleteproduct = async (sku, name) => {
    if (window.confirm("Delete " + name + " ...?")) {
      try {
        await Axios.delete(`${host}/product/${sku}`);
        setProducts((prevProducts) => prevProducts.filter((p) => p.sku !== sku)); // ✅ Update UI
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please check the server.");
      }
    }
  };

  const editproduct = (sku) => {
    navigate(`/editproductadmin/${sku}`);
  };

  const holdproduct = (product) => {
    axios
      .put(`${host}/products/${product.sku}/hold`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.sku === product.sku ? { ...p, hold: !p.hold } : p
          )
        );
      })
      .catch((error) => {
        console.error("Error updating hold status:", error);
      });
  };

  return (
    <div className="listproducts pt-3 pb-3">
      <div className="container shadebackground pb-2">
        <h1 className="mt-5 mb-3">Products List</h1>
        <table className="table border shadow text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>SKU</th>
              <th>Description</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.sku}> {/* ✅ unique key */}
                <td>{product.name}</td>
                <td>
                  <b>{locale}</b> {(product.price * localevalue).toFixed(2)}
                </td>
                <td>{product.sku}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className="btn btn-success mx-1"
                    onClick={() => editproduct(product.sku)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => deleteproduct(product.sku, product.name)}
                  >
                    Delete
                  </button>
                  <button
                    className={`btn mx-1 ${
                      product.hold ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() => holdproduct(product)}
                  >
                    {product.hold ? "un-hold" : "hold"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
