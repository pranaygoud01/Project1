import React from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const ReviewForm = ( {contact,date}) => {
    const stars = [1,2,3,4,5,6,7,8,9,10];
    const [customerName, setCustomerName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            const review = {
                contact,
                customerName,
                date,
                rating,
                comment
            };
            axios.post('http://localhost:8080/review/add', review);
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    const StarRating = () => {
    
        const handleClick = (star) => {
            setRating(star);
        };
    
        return (
            <div style={{ display: 'inline-block' }}>
                {stars.map((star, index) => (
                    <span
                        key={index}
                        className={`star ${star <= rating ? 'selected' : ''}`}
                        onClick={() => handleClick(star)}
                        style={{ fontSize: '24px', cursor: 'pointer', color: star <= rating ? '#ffd700' : '#ccc' }}
                    >   {'★'}
                    </span>
                ))}
            </div>
        );
    };
    
    StarRating.propTypes = {
        rating: PropTypes.number.isRequired,
        setRating: PropTypes.func.isRequired,
    };


    return (<div className='container shadow my-4 py-3'>
        <h3 style={{textAlign:'center'}} className='my-3'>Leave a Review</h3>
        <form onSubmit={(e)=>handleSubmit(e)} className='mx-auto' style={{textAlign:'center'}}>
            <div className='my-3'>
                <label className='form-label'>
                    Name:
                    <input
                        type="text"
                        className='form-control'
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div className='my-3'>
                <label className='form-label'>
                    Rating:<br/>
                   {StarRating()}
                </label>
            </div>
            <div className='my-3'>
                <label className='form-label'>
                    Comment:
                    <textarea
                        value={comment}
                        className='form-control'
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        cols={30}
                        required
                    />
                </label>
            </div>
            <button type="submit" className='btn btn-success my-3'>Submit Review</button>
        </form>
        </div>
    );
};

export default ReviewForm;
