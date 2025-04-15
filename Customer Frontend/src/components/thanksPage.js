// src/components/thanksPage.js
import React from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import "../CSS/App.css";

/*const ThanksPage = () => {
    const { orderNo, tableNo, amount } = useParams();
    const navigate = useNavigate();

    return (
        <div className="background">
            <div className="container bg-success" style={{ position: 'relative', textAlign: 'center', height: '200px', top: '25vh' }}>
                <p className="my-auto" style={{ alignContent: 'center', top: '30%' }}>
                    <h4>Thanks for Your Order</h4>
                    <br />
                    <h6>Your Order Number is <b style={{ color: 'orange' }}>{orderNo}</b> </h6>
                </p>
                <button className="btn bg-warning mx-2" onClick={() => navigate('/menu')}>Order more Items</button>
                <button className="btn bg-warning mx-2" onClick={() => navigate(`/invoice`)}>Get Bill</button>
            </div>
        </div>
    );
};

*/
const ThanksPage = () => {
    const navigate = useNavigate();

    return (
        <div className="background">
            <div className="container bg-success" style={{ position: 'relative', textAlign: 'center', height: '200px', top: '25vh' }}>
                <p className="my-auto" style={{ alignContent: 'center', top: '30%' }}>
                    <h4>Thanks for Your Order</h4>
                    <br />
                   {/* <h6>Your Order Number is <b style={{ color: 'orange' }}>#Generated</b> </h6>*/}
                </p>
              {/* <button className="btn bg-warning mx-2" onClick={() => navigate('/menu')}>Order more Items</button>*/}
                <button className="btn bg-warning mx-2" onClick={() => navigate('/invoice')}>Get Bill</button>
            </div>
        </div>
    );
};


export default ThanksPage;


