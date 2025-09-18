// import React, { useState } from "react";
// import "./StoreRating.css"; // optional css file

// const StoreRating = () => {
//   // Sample data
//   const [stores, setStores] = useState([
//     {
//       id: 1,
//       name: "Store Name",
//       address: "175, Nustre Cevaen",
//       overallRating: 4,
//       myRating: 4,
//     },
//     {
//       id: 2,
//       name: "Wiare Name",
//       address: "123, Vilera, Sesem",
//       overallRating: 3,
//       myRating: 2,
//     },
//     {
//       id: 3,
//       name: "Unod Name",
//       address: "125, Nadion",
//       overallRating: 4,
//       myRating: 5,
//     },
//   ]);

//   const [search, setSearch] = useState("");

//   // Handle rating change
//   const handleRatingChange = (id, newRating) => {
//     setStores((prevStores) =>
//       prevStores.map((store) =>
//         store.id === id ? { ...store, myRating: newRating } : store
//       )
//     );
//   };

//   // Filtered stores
//   const filteredStores = stores.filter((store) =>
//     store.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Store Rating</h2>

//       {/* Search Bar + Logout */}
//       <div style={styles.header}>
//         <input
//           type="text"
//           placeholder="Search for stores..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={styles.search}
//         />
//         <button style={styles.logout}>Logout</button>
//       </div>

//       {/* Store List */}
//       <div>
//         {filteredStores.map((store) => (
//           <div key={store.id} style={styles.card}>
//             <div>
//               <h3>{store.name}</h3>
//               <p style={{ color: "#666" }}>{store.address}</p>
//             </div>

//             <div>
//               <p>
//                 Overall Rating:{" "}
//                 {"⭐".repeat(store.overallRating) +
//                   "☆".repeat(5 - store.overallRating)}
//               </p>
//               <p>4.5 / 5</p>
//             </div>

//             <div>
//               <p>
//                 Your Rating:{" "}
//                 {"⭐".repeat(store.myRating) +
//                   "☆".repeat(5 - store.myRating)}
//               </p>
//               <button
//                 style={{
//                   ...styles.button,
//                   backgroundColor: store.myRating ? "#007bff" : "#ff5722",
//                 }}
//                 onClick={() => handleRatingChange(store.id, 5)} // Example: set max rating
//               >
//                 {store.myRating ? "Modify Rating" : "Submit Rating"}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Inline CSS
// const styles = {
//   container: {
//     padding: "20px",
//     maxWidth: "800px",
//     margin: "auto",
//     fontFamily: "Arial, sans-serif",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "20px",
//   },
//   search: {
//     flex: 1,
//     padding: "10px",
//     marginRight: "10px",
//     borderRadius: "20px",
//     border: "1px solid #ccc",
//   },
//   logout: {
//     backgroundColor: "red",
//     color: "white",
//     border: "none",
//     borderRadius: "20px",
//     padding: "10px 20px",
//     cursor: "pointer",
//   },
//   card: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottom: "1px solid #eee",
//     padding: "15px 0",
//   },
//   button: {
//     border: "none",
//     color: "white",
//     padding: "8px 12px",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default StoreRating;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';

// --- Reusable Star Rating Component ---
const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  return (
    <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={ratingValue}
            onClick={() => interactive && onRatingChange(ratingValue)}
            onMouseOver={() => interactive && onRatingChange(ratingValue)} // Optional: for hover effect
          >
            {ratingValue <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </div>
  );
};


// --- Main StoreRating Page Component ---
function StoreRating() {
  const { storeId } = useParams(); // Gets the store ID from the URL, e.g., /store/1
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUserRating, setCurrentUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Simulate fetching data from an API when the component loads
  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    // `const response = await api.get(`/stores/${storeId}`);`
    const mockStoreData = {
      id: storeId,
      name: 'Central Perk Cafe',
      address: '123 Main Street, Anytown',
      overallRating: 4.5,
      reviews: [
        { id: 1, user: 'Alice', rating: 5, comment: 'Great coffee and cozy atmosphere!' },
        { id: 2, user: 'Bob', rating: 4, comment: 'Good place to work, but can get crowded.' },
        { id: 3, user: 'Charlie', rating: 4, comment: 'Loved the pastries. A bit pricey.' },
      ],
    };

    setStore({ id: mockStoreData.id, name: mockStoreData.name, address: mockStoreData.address, overallRating: mockStoreData.overallRating });
    setReviews(mockStoreData.reviews);
    
    // Simulate fetching the current user's existing rating
    setCurrentUserRating(4); // Let's say the current user already rated it 4 stars

  }, [storeId]);


  const handleRatingSubmit = () => {
    // In a real app, you would post this data to your backend
    // await api.post(`/stores/${storeId}/rate`, { rating: currentUserRating, comment: reviewText });
    alert(`Submitting your rating of ${currentUserRating} stars and review: "${reviewText}"`);
    
    // Optimistically add the new review to the list
    const newReview = {
        id: Date.now(), // temporary key
        user: 'You', // placeholder for current user's name
        rating: currentUserRating,
        comment: reviewText,
    };
    setReviews([newReview, ...reviews]);
    setReviewText('');
  };

  if (!store) {
    return <div>Loading store details...</div>;
  }

  return (
    <>
      {/* Basic CSS for Styling */}
      <style>{`
        .store-details-container { font-family: sans-serif; max-width: 900px; margin: 2rem auto; }
        .store-header { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; margin-bottom: 2rem; }
        .store-header h1 { margin: 0 0 0.5rem 0; }
        .store-header p { margin: 0; color: #777; }
        .overall-rating-display { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; font-size: 1.2rem; }
        .star-rating { color: #f39c12; font-size: 1.5rem; }
        .star-rating.interactive span { cursor: pointer; }

        .user-review-section { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .user-review-section h3 { margin-top: 0; text-align: center; }
        .interactive-stars { display: flex; justify-content: center; font-size: 2rem; margin-bottom: 1rem; }
        .review-form textarea { width: 100%; min-height: 100px; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; margin-bottom: 1rem; }
        .review-form button { display: block; width: 100%; padding: 0.8rem; border: none; border-radius: 6px; background-color: #3498db; color: white; font-size: 1.1rem; cursor: pointer; }

        .reviews-list h3 { margin-top: 0; }
        .review-card { display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid #eee; }
        .review-card:last-child { border-bottom: none; }
        .review-avatar { font-size: 2.5rem; color: #ccc; }
        .review-content strong { display: block; margin-bottom: 0.25rem; }
      `}</style>

      <div className="store-details-container">
        <div className="store-header">
          <h1>{store.name}</h1>
          <p>{store.address}</p>
          <div className="overall-rating-display">
            <StarRating rating={store.overallRating} />
            <span>({store.overallRating.toFixed(1)})</span>
          </div>
        </div>

        <div className="user-review-section">
          <h3>Your Rating & Review</h3>
          <div className="interactive-stars">
            <StarRating
              rating={currentUserRating}
              onRatingChange={setCurrentUserRating}
              interactive={true}
            />
          </div>
          <div className="review-form">
            <textarea
              placeholder="Tell us about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button onClick={handleRatingSubmit}>Submit Your Review</button>
          </div>
        </div>

        <div className="reviews-list">
            <h3>All Reviews</h3>
            {reviews.map(review => (
                <div key={review.id} className="review-card">
                    <div className="review-avatar">
                        <FaUserCircle />
                    </div>
                    <div className="review-content">
                        <strong>{review.user}</strong>
                        <StarRating rating={review.rating} />
                        <p>{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default StoreRating;