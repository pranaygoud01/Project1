// import React, { useState } from 'react';
// import axios from 'axios';
// import './ReviewComponent.css';

// const ReviewComponent = () => {
//     const [review, setReview] = useState('');
//     const [rating, setRating] = useState(0);
//     const [hoverRating, setHoverRating] = useState(0);

//     const handleReviewChange = (e) => {
//         setReview(e.target.value);
//     };

//     const handleRatingChange = (newRating) => {
//         setRating(newRating);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const reviewData = { review, rating };

//         axios.post('http://localhost:8080/review/add', reviewData)
//             .then(response => {
//                 console.log('Review submitted:', response.data);
//                 alert("Review submitted successfully!"); // Popup alert
//                 setReview('');
//                 setRating(0);
//             })
//             .catch(error => {
//                 console.error('There was an error submitting the review!', error);
//             });
//     };

//     return (
//         <div className="review-component">
//             <h2>Leave a Review</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="rating-container">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                             key={star}
//                             starId={star}
//                             rating={hoverRating || rating}
//                             onMouseEnter={() => setHoverRating(star)}
//                             onMouseLeave={() => setHoverRating(0)}
//                             onClick={() => handleRatingChange(star)}
//                         />
//                     ))}
//                 </div>
//                 <div className="review-container">
//                     <textarea
//                         placeholder="Write your review here..."
//                         value={review}
//                         onChange={handleReviewChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Submit Review</button>
//             </form>
//         </div>
//     );
// };

// const Star = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) => {
//     return (
//         <span
//             className={rating >= starId ? "star filled" : "star"}
//             onMouseEnter={onMouseEnter}
//             onMouseLeave={onMouseLeave}
//             onClick={onClick}
//         >
//             {rating >= starId ? '\u2605' : '\u2606'}
//         </span>
//     );
// };

// export default ReviewComponent;
