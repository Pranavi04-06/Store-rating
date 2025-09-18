import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

// --- Reusable Star Rating Component ---
// This component can display ratings and optionally be interactive.

const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} />);
    } else {
      stars.push(<FaRegStar key={i} />);
    }
  }

  return (
    <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={ratingValue}
            onClick={() => interactive && onRatingChange(ratingValue)}
          >
            {ratingValue <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </div>
  );
};

// --- Main Store List Component ---

function StoreListPage() {
  // Mock data - in a real app, you would fetch this from an API
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to manage the user's personal ratings for each store
  const [userRatings, setUserRatings] = useState({
    1: 4, // User has already rated store with id 1
    3: 5, // User has already rated store with id 3
  });

  // Simulate fetching data when the component loads
  useEffect(() => {
    const mockStores = [
      { id: 1, name: 'Store Name', address: '175, Nustre Cevaen', overallRating: 4.5 },
      { id: 2, name: 'Wiare Name', address: '123, Vilera, Sesem', overallRating: 4.5 },
      { id: 3, name: 'Unod Name', address: '125, Nadion', overallRating: 4.5 },
      { id: 4, name: 'Gadget Grove', address: '456 Tech Avenue', overallRating: 4.2 },
      { id: 5, name: 'Book Nook', address: '789 Story Lane', overallRating: 4.8 },
    ];
    setStores(mockStores);
  }, []);

  const handleRatingChange = (storeId, rating) => {
    setUserRatings(prevRatings => ({
      ...prevRatings,
      [storeId]: rating,
    }));
  };
  
  const handleSubmitOrModify = (storeId) => {
    const rating = userRatings[storeId];
    // In a real app, you would send this to your backend API
    alert(`Submitting rating of ${rating} for store ID ${storeId}`);
  };

  const handleLogout = () => {
    alert('Logging out...');
    // Add your actual logout logic here
  };
  
  // Filter stores based on the search term
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* --- Basic CSS for Styling --- */}
      <style>{`
        .store-rating-container { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header h1 { margin: 0; font-size: 1.8rem; }
        .search-bar { flex-grow: 1; margin: 0 1.5rem; }
        .search-bar input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; }
        .btn-logout { background-color: #e74c3c; color: white; }
        .store-card { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; align-items: center; background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .store-info h3 { margin: 0 0 0.25rem 0; }
        .store-info p { margin: 0; color: #777; }
        .rating-section { text-align: center; }
        .rating-section h4 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #555; font-weight: normal; }
        .star-rating { color: #f39c12; font-size: 1.2rem; }
        .star-rating.interactive span { cursor: pointer; }
        .rating-value { font-size: 0.9rem; color: #888; margin-top: 0.25rem; }
        .action-section { text-align: center; }
        .btn-submit { background-color: #f39c12; color: white; }
        .btn-modify { background-color: #3498db; color: white; }
      `}</style>
      
      <div className="store-rating-container">
        <div className="header">
          <h1>Store Rating</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleLogout} className="btn btn-logout">Logout</button>
        </div>

        <div className="store-list">
          {filteredStores.map(store => (
            <div key={store.id} className="store-card">
              <div className="store-info">
                <h3>{store.name}</h3>
                <p>{store.address}</p>
              </div>

              <div className="rating-section">
                <h4>Overall Rating</h4>
                <StarRating rating={store.overallRating} />
                <div className="rating-value">{store.overallRating} / 5</div>
              </div>

              <div className="rating-section">
                <h4>Your Rating</h4>
                <StarRating
                  rating={userRatings[store.id] || 0}
                  onRatingChange={(rating) => handleRatingChange(store.id, rating)}
                  interactive={true}
                />
              </div>

              <div className="action-section">
                <button
                  onClick={() => handleSubmitOrModify(store.id)}
                  className={`btn ${userRatings[store.id] ? 'btn-modify' : 'btn-submit'}`}
                >
                  {userRatings[store.id] ? 'Modify Rating' : 'Submit Rating'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StoreListPage;