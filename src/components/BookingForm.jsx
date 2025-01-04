
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Modal, List, ListItem, ListItemButton } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { generateTimeSlots } from '../utils/generateSlots';

const BookingForm = () => {
  const [formData, setFormData] = useState({ name: '', contact: '', guests: '', date: '', time: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setFormData({ ...formData, date: formattedDate });
    fetchBookings(formattedDate);
  }, [selectedDate]);

  // Fetch bookings for the selected date
  const fetchBookings = async (date) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings?date=${date}`);
      setBookedSlots(response.data.map((b) => b.time));
      setAvailableSlots(generateTimeSlots('10:00', '22:00', 30));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time });
    setOpenModal(false);  // Close modal after selecting time
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const username = localStorage.getItem('username');  // Logged-in username
    if (!username) {
      setError('You must be logged in to make a booking.');
      return;
    }

    const bookingData = { ...formData, username };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, bookingData, { withCredentials: true });
      setSuccess('Booking successful! Redirecting to summary...');
      setTimeout(() => navigate('/summary', { state: { booking: response.data.booking } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Restaurant Table Booking
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth margin="normal" required />
        <TextField label="Contact (10-digit)" name="contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} fullWidth margin="normal" required />
        <TextField label="Number of Guests" type="number" name="guests" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} fullWidth margin="normal" required />
        <Calendar onChange={(date) => setSelectedDate(date)} value={selectedDate} tileDisabled={({ date }) => date < new Date()}/>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => setOpenModal(true)}>
          Select Time Slot
        </Button>
        <Typography sx={{ mt: 1 }}><strong>Selected Time Slot:</strong> {formData.time || 'None selected'}</Typography>
        <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
          Book Table
        </Button>
      </form>

      {/* Modal for Time Slots */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'white',
            borderRadius: 2,
            maxWidth: 400,
            mx: 'auto',
            mt: '10vh',
          }}
        >
          <Typography variant="h6" textAlign="center" gutterBottom>
            Select Time Slot
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <List>
              {availableSlots.map((slot) => (
                <ListItem key={slot} disablePadding>
                  <ListItemButton
                    disabled={bookedSlots.includes(slot)}
                    onClick={() => handleTimeSelect(slot)}
                    sx={{
                      textAlign: 'center',
                      bgcolor: bookedSlots.includes(slot) ? '#f5f5f5' : '#1976d2',
                      color: bookedSlots.includes(slot) ? '#888' : '#fff',
                      borderRadius: 1,
                      my: 0.5,
                      '&:hover': {
                        bgcolor: bookedSlots.includes(slot) ? '#f5f5f5' : '#1565c0',
                      },
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{slot}</span>
                    {bookedSlots.includes(slot) && (
                      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                        Booked
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingForm;
