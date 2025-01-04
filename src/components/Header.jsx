import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();  // Using context for global state
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();  //context state and localStorage is cleared
    navigate('/login');  // Redirecting to login page after logout
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Restaurant Table Booking</Typography>
        <div>
          {!isLoggedIn ? (
            <>
              <Button component={Link} to="/signup" color="inherit">
                Signup
              </Button>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/" color="inherit">
                Home
              </Button>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
