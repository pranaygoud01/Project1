import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [value, setValue] = useState(1);
  const [locale, setLocale] = useState("₹");
  const [currency, setCurrency] = useState("INR");

  const [cartCount, setCartCount] = useState(0);
  const [option, setOption] = useState("dine-in");

  const [user, setUser] = useState(() => parseInt(localStorage.getItem("customerId")) || null);
  const [orderNo, setOrderNo] = useState(() => parseInt(localStorage.getItem("renderCount")) || 10000);
  const [contact, setContact] = useState();
  const [today, setToday] = useState(null);

  const [SGST, setSGST] = useState();
  const [CGST, setCGST] = useState();
  const [upiId, setUpiId] = useState();
  const [serviceTax, setServiceTax] = useState();

  const host = "http://localhost:8080";

  const localization = (val, loc, curr) => {
    setValue(val);
    setLocale(loc);
    setCurrency(curr);
  };

  useEffect(() => {
    document.title = "Restaurent-App - Customer";

    const fetchSettings = async () => {
      try {
        const [sgstRes, cgstRes, upiRes, serviceTaxRes] = await Promise.all([
          axios.get(`${host}/settings/sgst`),
          axios.get(`${host}/settings/cgst`),
          axios.get(`${host}/settings/upiid`),
          axios.get(`${host}/settings/serviceTax`),
        ]);
        setSGST(sgstRes.data);
        setCGST(cgstRes.data);
        setUpiId(upiRes.data);
        setServiceTax(serviceTaxRes.data);
      } catch (err) {
        console.log("Error fetching settings:", err);
      }
    };

    fetchSettings();

    setUser((prevCount) => {
      if (prevCount) {
        const newUser = prevCount + 1;
        localStorage.setItem("userId", newUser);
        return newUser;
      } else {
        localStorage.setItem("userId", 10000);
        return 10000;
      }
    });

    setOrderNo((prevCount) => {
      const currentDate = new Date().toISOString().split("T")[0];
      const storedDate = new Date(localStorage.getItem("date")).toISOString().split("T")[0];

      if (storedDate && currentDate === storedDate) {
        const newCount = prevCount + 1;
        localStorage.setItem("renderCount", newCount);
        setToday(currentDate);
        return newCount;
      } else {
        localStorage.setItem("date", currentDate);
        localStorage.setItem("renderCount", 10000);
        setToday(currentDate);
        return 10000;
      }
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        value,
        locale,
        currency,
        cartCount,
        setCartCount,
        localization,
        option,
        setOption,
        user,
        orderNo,
        today,
        contact,
        setContact,
        SGST,
        CGST,
        upiId,
        serviceTax,
        host,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
