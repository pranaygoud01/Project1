import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

export default function Main  ({localization}) {
    const [country, setcountry] = useState([]);
    // const [value, setvalue] = useState(1);
    // const [locale,setlocale]=useState("INR")

    useEffect(() => {
        getdata();
    }, []);

    const getdata = async () => {
        const result = await Axios.get("https://v6.exchangerate-api.com/v6/49868c761446ada26478ac44/latest/INR");
        setcountry(result.data.conversion_rates);
    }
    const ondatachange=(currency,country)=>{
        const symbol=()=>{
            switch (currency) {
                case "INR":
                    return "₹";
                    
                    case "USD":
                    return "$";
                   
                    case "EUR":
                    return "€";
                    
                    case "GBP":
                    return "£";

                    default:
                    return "X"       
            }
        }
        const value=country[currency];
       

        localization(value,symbol,currency);
    }
   

    return (
        
            <div className="Paper mx-3 my-auto">
                <form /*onSubmit={e => convert(e)}*/>
                    {/* <div>
                        <input
                            value={text1 || ''}
                            onChange={e => settext1(e.target.value)}
                            autocomplete="off"
                        />

                        <select variant="outlined"
                            className="dropdown"
                            onChange={e => setvalue1(e.target.value)}>
                            <option key="INR" value={country1.INR} defaultChecked>INR</option>
                            <option key="USD" value={country1.USD}>USD</option>
                            <option key="EUR" value={country1.EUR}>EUR</option>
                            <option key="GBP" value={country1.GBP}>GBP</option>
                        </select>
                    </div> */}
                    <div>
                        {/* <input
                            value={text2 || ''}
                            onChange={e => settext2(e.target.value)}
                            autocomplete="off"
                        /> */}

                        <select variant="outlined"
                            className="dropdown"
                            onChange={e => {ondatachange(e.target.value,country)}}>
                            <option  value="INR" defaultChecked>INR</option>
                            <option  value="USD">USD</option>
                            <option  value="EUR">EUR</option>
                            <option  value="GBP">GBP</option>
                        </select>
                    </div>
                </form>
           
        </div>
    )
}
// export {value,locale}