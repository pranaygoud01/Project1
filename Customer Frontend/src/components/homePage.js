import React from "react";
import { useNavigate } from "react-router-dom";
import dineinimage from "../Images/dineinimage.jpg";
import takeawayimage from "../Images/takeaway.jpg";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../CSS/App.css";
import vinlogo from "../Images/vinnaglogo.jpg";

const HomePage = ({ options, setContact, contact }) => {
    const navigate = useNavigate();
    const handleButtonClick = (option) => {
        if(contact){
            if (contact.length === 10 && /^\d+$/.test(contact)) {
                options(option);
                navigate('/menu');
            } else {
                window.alert('Enter 10 digit number')
            }
        } else {
            window.alert("Please Enter Mobile No..")
        }
    };

    return (
        <div className="background">
            <div className="content-container container mt-3 pb-2 col-9 shadow">
                <div style={{ textAlign: 'center' }} className="pt-4">
                    <label className="form-label" style={{ color: 'grey' }}>
                        <h5>Mobile No.</h5>
                        <input
                            className="form-control"
                            type="text"
                            pattern="[0-9]{10}"
                            minLength={10}
                            maxLength={10}
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Please Enter Mobile No.."
                            required
                            autoComplete="true"
                        />
                    </label>
                </div>
                <div className="container my-4 col-md-10 col-lg-6" style={{ textAlign: 'center' }}>
                    <div className="options">
                        <button onClick={() => handleButtonClick('dine-in')} className="btn btn-lg btn-success my-2 mx-5">Dine-In</button>
                        <button onClick={() => handleButtonClick('take-away')} className="btn btn-lg btn-danger my-2 mx-5">Take-Away</button>
                    </div>
                </div>
            </div>
            <div className="footer-section pt-5 pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <img src={vinlogo} height={70} alt="Logo" />
                            <h1 className="footer-section-mail-id">orderfood@vinnag.com</h1>
                            <p className="footer-section-address">
                                Hyderabad, Telangana, India.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
