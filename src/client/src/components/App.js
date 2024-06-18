import React, { useState, useEffect } from "react";
import '../styles/App.css';
import '../styles/bootstrap.min.css';
import { movies, slots, seats } from "./data";

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [seatCounts, setSeatCounts] = useState({
    A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0
  });
  const [lastBooking, setLastBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMovie && selectedSlot) {
      fetchLastBooking(selectedMovie, selectedSlot);
    }
  }, [selectedMovie, selectedSlot]);

  const fetchLastBooking = async (movie, slot) => {
    setLoading(true);
    try {
      const response = await fetch(`https://bookmyshow-backend-c36h.onrender.com/api/booking?movie=${movie}&slot=${slot}`);
      const data = await response.json();
      setLastBooking(data);
    } catch (error) {
      console.error("Error fetching last booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSeatChange = (seat, count) => {
    setSeatCounts(prevCounts => ({
      ...prevCounts,
      [seat]: count >= 0 ? parseInt(count) : 0
    }));
  };

  const handleBooking = async () => {
    const booking = {
      movie: selectedMovie,
      slot: selectedSlot,
      seats: seatCounts
    };

    try {
      const response = await fetch("https://bookmyshow-backend-c36h.onrender.com/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
      });
      const data = await response.json();
      setUpdatedBooking(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <h1>Book that show!!</h1>

        <div className="movie-row">
          <h2>Select A Movie</h2>
          {movies.map(movie => (
            <div
              key={movie}
              className={`movie-column ${selectedMovie === movie ? 'movie-column-selected' : ''}`}
              onClick={() => handleMovieClick(movie)}
            >
              {movie}
            </div>
          ))}
        </div>

        <div className="slot-row">
          <h2>Select a Time slot</h2>
          {slots.map(slot => (
            <div
              key={slot}
              className={`slot-column ${selectedSlot === slot ? 'slot-column-selected' : ''}`}
              onClick={() => handleSlotClick(slot)}
            >
              {slot}
            </div>
          ))}
        </div>

        <div className="seat-row">
          <h2>Select the seats</h2>
          {seats.map(seat => (
            <div key={seat} className="seat-column">
              <div>
                <label>Type {seat}</label>
              </div>
              <div>
                <input
                  className="num"
                  type="number"
                  value={seatCounts[seat]}
                  onChange={(e) => handleSeatChange(seat, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="book-button">
          <button onClick={handleBooking}>Book Now</button>
        </div>
      </div>

      <div className="last-order">
        <h4>Last Booking Details:</h4>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Fetching Previous Data</p>
          </div>
        ) : lastBooking && lastBooking.seats ? (
          <div>
            <p>Movie: {lastBooking.movie}</p>
            <p>Slot: {lastBooking.slot}</p>
            <p>Seats:</p>
            {Object.keys(lastBooking.seats).map(seat => (
              <p key={seat}>{seat}: {lastBooking.seats[seat]}</p>
            ))}
          </div>
        ) : (
          <p>No previous booking found</p>
        )}
      </div>

      {updatedBooking && updatedBooking.seats && (
        <div className="updated-order">
          <h4>Updated Booking Details:</h4>
          <div>
            <p>Movie: {updatedBooking.movie}</p>
            <p>Slot: {updatedBooking.slot}</p>
            <p>Seats:</p>
            {Object.keys(updatedBooking.seats).map(seat => (
              <p key={seat}>{seat}: {updatedBooking.seats[seat]}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
