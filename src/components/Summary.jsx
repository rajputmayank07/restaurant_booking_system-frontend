
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();  // Track logged-in state from context
  const booking = location?.state?.booking || JSON.parse(localStorage.getItem('lastBooking')) || null;

  const [allBookings, setAllBookings] = useState([]);
  const [message, setMessage] = useState('');
  const loggedInUser = localStorage.getItem('username');  // Current logged-in username

  useEffect(() => {
    if (!isLoggedIn || !booking?.date) {
      navigate('/');  // Redirect to home if not logged in or no booking
      return;
    }
    fetchBookings(booking.date);
  }, [booking, isLoggedIn, navigate]);

  const fetchBookings = async (date) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings?date=${date}`);
      setAllBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, { withCredentials: true });
      setMessage('Your booking has been canceled successfully.');
      setAllBookings(allBookings.filter((b) => b._id !== bookingId));  // Remove canceled booking
    } catch (err) {
      console.error('Error canceling booking:', err);
      setMessage('Failed to cancel booking. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Booking Summary for {booking?.date || 'Selected Date'}
      </Typography>

      {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}

      {allBookings.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>No bookings for this date.</Typography>
      ) : (
        allBookings.map((b) => (
          <Box key={b._id} sx={{ p: 2, borderBottom: '1px solid #ddd', mt: 1 }}>
            <Typography><strong>Name:</strong> {b.name}</Typography>
            <Typography><strong>Time:</strong> {b.time}</Typography>
            <Typography><strong>Guests:</strong> {b.guests}</Typography>
            {b.username === loggedInUser ? (
              <Typography><strong>Contact:</strong> {b.contact}</Typography>
            ) : (
              <Typography sx={{ color: '#888', fontStyle: 'italic' }}>Contact: Hidden for privacy</Typography>
            )}
            {b.username === loggedInUser && (
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => handleCancel(b._id)}
              >
                Cancel My Booking
              </Button>
            )}
          </Box>
        ))
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => navigate('/')}
      >
        Make Another Booking
      </Button>
    </Box>
  );
};

export default Summary;
