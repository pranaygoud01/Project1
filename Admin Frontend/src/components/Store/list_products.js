import { useEffect, useState } from "react";
import Axios from "axios";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { useNavigate } from "react-router-dom";
import "../../CSS/App.css";
import axios from "axios";


export default function ListProducts({host,localevalue,locale}) {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`${host}/allproducts`)
            .then(res => res.json())
            .then((result) => setProducts(result))
    }, [products]);

    const deleteproduct = async (sku,name) => {
        if(window.confirm("Delete "+name+" ...?")){
            await Axios.delete(`${host}/product/${sku}`);
        }
        navigate("/productslist");
    }

    const editproduct = (sku) => {
        navigate(`/editproducts/${sku}`);
    }

    const holdproduct = (product) => {
        axios.put(`${host}/products/${product.sku}/hold`)
            .then(() => {
                // Optionally update UI after successful toggle
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.sku === product.sku ? { ...p, hold: !p.hold } : p
                    )
                );
            })
            .catch(error => {
                console.error("Error updating hold status:", error);
            });
    };

    return (<div className="listproducts pt-3 pb-3">
        <div className="container shadebackground pb-2" >
            <h1 className="mt-5 mb-3">Products List</h1>
            <table className="table border shadow text-center" >
                <thead>
                    <tr><th>Name</th>
                        <th>Price</th>
                        <th>SKU</th>
                       {/* <th>Discount-%</th>*/}
                        <th>Description</th>
                        <th colSpan={2}>Action</th>
                    </tr></thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr>
                            <td key={index.name}>{product.name}</td>
                            <td key={index.price}><b>{locale}</b> {(product.price*localevalue).toFixed(2)}</td>
                            <td key={index.sku}>{product.sku}</td>
                            {/*<td key={index.discount}>{product.discount}</td>*/}
                            <td key={index.description}>{product.description}</td>
                            <td>
                                {/*<button className="btn btn-success mx-1 " onClick={() => editproduct(product.sku)}>Edit</button>
                                <button className="btn btn-danger mx-1" onClick={() => deleteproduct(product.sku,product.name)}>Delete</button>
                                */}
                                 <button
                                    className={`btn mx-1 ${product.hold ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => holdproduct(product)}
                                >
                                    {product.hold ? 'un-hold' : 'hold'}
                                </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div></div>
    )
}