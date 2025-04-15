
import axios from "axios";
import { useEffect, useState } from "react";

const Reviews=({host})=>{
    const [reviews,setReviews]=useState([{}]);
    useEffect(()=>{
        const response=axios.get(`${host}/reviews`);
        response.then((result)=>{
            setReviews(result.data);
        })
    },[])

    return <div className='container shadow mx-auto my-3 pb-2 shadebackground'>
      <h2>Customer Reviews</h2>
      <table className='table mx-auto'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr>
              <td>{review.date}</td>
              <td>{review.customerName}</td>
              <td>{review.contact}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
}
export default Reviews;