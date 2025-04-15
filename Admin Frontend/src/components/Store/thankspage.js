import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const ThanksPage=()=>{
    const {orderNo,tableNo,amount} =useParams();
    const navigate=useNavigate();
    return <div className="container bg-success" style={{position:'relative', textAlign:'center',height:'200px',top:'25vh'}}>
        <p className="my-auto" style={{alignContent:'center',top:'30%'}}><h4>Thanks for Your Order</h4><br/><h6>Your Order Number is <b style={{color:'orange'}}>{orderNo}</b> and Your table Number is <b style={{color:'orange'}}>{tableNo}</b></h6></p>
        <button className="btn bg-warning mx-2" onClick={()=>navigate('/menu')}>Order more Items</button>
        <button className="btn bg-warning mx-2" onClick={()=>{navigate(`/invoice`)}}>Get Bill</button>
    </div>
}
export default ThanksPage;